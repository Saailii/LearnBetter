import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import ReviewsController from '#controllers/reviews_controller'
import CoursesController from '#controllers/courses_controller'

test.group('Reviews', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('records a due card only once when the same form is submitted twice', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Review Tester',
      email: 'review@example.com',
      password: 'password123',
    })
    const now = new Date()
    const [courseId] = await db.table('courses').insert({
      user_id: user.id,
      title: 'Course',
      status: 'active',
      created_at: now,
      updated_at: now,
    })
    const [chapterId] = await db.table('chapters').insert({
      course_id: courseId,
      key: 'chapter',
      title: 'Chapter',
      position: 1,
      summary: null,
      created_at: now,
      updated_at: now,
    })
    const [conceptId] = await db.table('concepts').insert({
      chapter_id: chapterId,
      key: 'concept',
      title: 'Concept',
      explanation: 'Explanation',
      position: 1,
      mastery_state: 'new',
      created_at: now,
      updated_at: now,
    })
    const [cardId] = await db.table('flashcards').insert({
      concept_id: conceptId,
      type: 'question_answer',
      front: 'Question',
      back: 'Answer',
      due_at: new Date(now.getTime() - 60_000),
      created_at: now,
      updated_at: now,
    })

    const controller = new ReviewsController()
    const flashes: Array<[string, string]> = []
    const context = {
      auth: { getUserOrFail: () => user },
      request: {
        input: (name: string) => ({ cardId, grade: 'good' })[name as 'cardId' | 'grade'],
      },
      response: {
        notFound: () => 'not-found',
        redirect: () => ({
          back: () => 'back',
          toPath: (path: string) => path,
        }),
      },
      session: { flash: (key: string, value: string) => flashes.push([key, value]) },
    }

    await controller.store(context as never)
    await controller.store(context as never)

    const card = await db.from('flashcards').where('id', cardId).firstOrFail()
    const attempts = await db.from('review_attempts').where('flashcard_id', cardId)

    assert.equal(card.repetitions, 1)
    assert.lengthOf(attempts, 1)
    assert.isTrue(flashes.some(([key]) => key === 'error'))
  })

  test('reports the complete number of due cards beyond the display batch size', async ({
    assert,
  }) => {
    const user = await User.create({
      fullName: 'Queue Tester',
      email: 'queue@example.com',
      password: 'password123',
    })
    const now = new Date()
    const [courseId] = await db.table('courses').insert({
      user_id: user.id,
      title: 'Course',
      status: 'active',
      created_at: now,
      updated_at: now,
    })
    const [chapterId] = await db.table('chapters').insert({
      course_id: courseId,
      key: 'chapter',
      title: 'Chapter',
      position: 1,
      summary: null,
      created_at: now,
      updated_at: now,
    })
    const [conceptId] = await db.table('concepts').insert({
      chapter_id: chapterId,
      key: 'concept',
      title: 'Concept',
      explanation: 'Explanation',
      position: 1,
      mastery_state: 'new',
      created_at: now,
      updated_at: now,
    })

    await db.table('flashcards').multiInsert(
      Array.from({ length: 31 }, (_, index) => ({
        concept_id: conceptId,
        type: 'question_answer',
        front: `Question ${index}`,
        back: `Answer ${index}`,
        due_at: new Date(now.getTime() - 60_000),
        created_at: now,
        updated_at: now,
      }))
    )

    let renderedProps: Record<string, unknown> | undefined
    const controller = new ReviewsController()
    await controller.show({
      auth: { getUserOrFail: () => user },
      inertia: {
        render: (_page: string, props: Record<string, unknown>) => {
          renderedProps = props
          return props
        },
      },
    } as never)

    assert.equal(renderedProps?.remaining, 31)
  })

  test('stores the selected course source on a new card and rejects a foreign source', async ({
    assert,
  }) => {
    const user = await User.create({
      fullName: 'Source Tester',
      email: 'source@example.com',
      password: 'password123',
    })
    const now = new Date()
    const [courseId] = await db.table('courses').insert({
      user_id: user.id,
      title: 'Course',
      status: 'active',
      created_at: now,
      updated_at: now,
    })
    const [otherCourseId] = await db.table('courses').insert({
      user_id: user.id,
      title: 'Other course',
      status: 'active',
      created_at: now,
      updated_at: now,
    })
    const [sourceId] = await db.table('course_sources').insert({
      course_id: courseId,
      type: 'book',
      title: 'Main source',
      created_at: now,
    })
    const [foreignSourceId] = await db.table('course_sources').insert({
      course_id: otherCourseId,
      type: 'book',
      title: 'Foreign source',
      created_at: now,
    })
    const [chapterId] = await db.table('chapters').insert({
      course_id: courseId,
      key: 'chapter',
      title: 'Chapter',
      position: 1,
      created_at: now,
      updated_at: now,
    })
    const [conceptId] = await db.table('concepts').insert({
      chapter_id: chapterId,
      key: 'concept',
      title: 'Concept',
      explanation: 'Explanation',
      position: 1,
      mastery_state: 'new',
      created_at: now,
      updated_at: now,
    })

    const controller = new CoursesController()
    let selectedSourceId = foreignSourceId
    const flashes: Array<[string, string]> = []
    const context = {
      auth: { getUserOrFail: () => user },
      params: { id: courseId },
      request: {
        input: (name: string, fallback?: unknown) =>
          ({
            conceptId,
            type: 'question_answer',
            front: 'Question',
            back: 'Answer',
            sourceId: selectedSourceId,
          })[name as 'conceptId' | 'type' | 'front' | 'back' | 'sourceId'] ?? fallback,
      },
      response: {
        notFound: () => 'not-found',
        redirect: () => ({
          back: () => 'back',
          toPath: (path: string) => path,
        }),
      },
      session: { flash: (key: string, value: string) => flashes.push([key, value]) },
    }

    await controller.storeCard(context as never)
    const [{ total: rejectedCardCount }] = await db.from('flashcards').count('* as total')
    assert.equal(Number(rejectedCardCount), 0)

    selectedSourceId = sourceId
    await controller.storeCard(context as never)

    const card = await db.from('flashcards').firstOrFail()
    assert.equal(card.course_source_id, sourceId)
    assert.isTrue(flashes.some(([key]) => key === 'error'))
    assert.isTrue(flashes.some(([key]) => key === 'success'))
  })
})
