import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('subjects', (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.string('name', 120).notNullable()
      table.string('color', 16).notNullable().defaultTo('#6d5dfc')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.unique(['user_id', 'name'])
    })

    this.schema.createTable('courses', (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table
        .integer('subject_id')
        .unsigned()
        .nullable()
        .references('subjects.id')
        .onDelete('SET NULL')
      table.string('title', 180).notNullable()
      table.text('description').nullable()
      table.string('status', 24).notNullable().defaultTo('draft')
      table.date('target_date').nullable()
      table.integer('import_version').notNullable().defaultTo(1)
      table.timestamp('activated_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.index(['user_id', 'status'])
    })

    this.schema.createTable('course_sources', (table) => {
      table.increments('id').notNullable()
      table
        .integer('course_id')
        .unsigned()
        .notNullable()
        .references('courses.id')
        .onDelete('CASCADE')
      table.string('type', 32).notNullable()
      table.string('title', 220).notNullable()
      table.text('reference').nullable()
      table.timestamp('created_at').notNullable()
    })

    this.schema.createTable('chapters', (table) => {
      table.increments('id').notNullable()
      table
        .integer('course_id')
        .unsigned()
        .notNullable()
        .references('courses.id')
        .onDelete('CASCADE')
      table.string('key', 120).notNullable()
      table.string('title', 180).notNullable()
      table.text('summary').nullable()
      table.integer('position').notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.unique(['course_id', 'key'])
    })

    this.schema.createTable('concepts', (table) => {
      table.increments('id').notNullable()
      table
        .integer('chapter_id')
        .unsigned()
        .notNullable()
        .references('chapters.id')
        .onDelete('CASCADE')
      table.string('key', 120).notNullable()
      table.string('title', 180).notNullable()
      table.text('explanation').notNullable()
      table.integer('position').notNullable().defaultTo(0)
      table.string('mastery_state', 24).notNullable().defaultTo('new')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.unique(['chapter_id', 'key'])
    })

    this.schema.createTable('self_tests', (table) => {
      table.increments('id').notNullable()
      table
        .integer('concept_id')
        .unsigned()
        .notNullable()
        .references('concepts.id')
        .onDelete('CASCADE')
      table.string('type', 32).notNullable()
      table.text('prompt').notNullable()
      table.text('options_json').nullable()
      table.text('expected_answer_json').notNullable()
      table.text('explanation').nullable()
      table.integer('difficulty').notNullable().defaultTo(2)
      table.integer('position').notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('flashcards', (table) => {
      table.increments('id').notNullable()
      table
        .integer('concept_id')
        .unsigned()
        .notNullable()
        .references('concepts.id')
        .onDelete('CASCADE')
      table.string('type', 32).notNullable()
      table.text('front').notNullable()
      table.text('back').notNullable()
      table.boolean('reversible').notNullable().defaultTo(false)
      table.timestamp('due_at').nullable()
      table.timestamp('last_reviewed_at').nullable()
      table.integer('interval_days').notNullable().defaultTo(0)
      table.integer('repetitions').notNullable().defaultTo(0)
      table.integer('lapses').notNullable().defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('concept_links', (table) => {
      table.increments('id').notNullable()
      table
        .integer('from_concept_id')
        .unsigned()
        .notNullable()
        .references('concepts.id')
        .onDelete('CASCADE')
      table
        .integer('to_concept_id')
        .unsigned()
        .notNullable()
        .references('concepts.id')
        .onDelete('CASCADE')
      table.string('label', 120).nullable()
      table.unique(['from_concept_id', 'to_concept_id'])
    })

    this.schema.createTable('review_attempts', (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table
        .integer('self_test_id')
        .unsigned()
        .nullable()
        .references('self_tests.id')
        .onDelete('SET NULL')
      table
        .integer('flashcard_id')
        .unsigned()
        .nullable()
        .references('flashcards.id')
        .onDelete('SET NULL')
      table.text('response_json').nullable()
      table.string('grade', 16).notNullable()
      table.float('score').nullable()
      table.text('feedback_json').nullable()
      table.timestamp('reviewed_at').notNullable()
      table.index(['user_id', 'reviewed_at'])
    })

    this.schema.createTable('daily_availabilities', (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.integer('day_of_week').notNullable()
      table.integer('minutes').notNullable().defaultTo(30)
      table.unique(['user_id', 'day_of_week'])
    })

    this.schema.createTable('study_sessions', (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.integer('course_id').unsigned().nullable().references('courses.id').onDelete('SET NULL')
      table.date('planned_for').notNullable()
      table.integer('duration_minutes').notNullable()
      table.string('status', 24).notNullable().defaultTo('planned')
      table.string('google_event_id', 255).nullable()
      table.timestamp('completed_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.index(['user_id', 'planned_for'])
    })

    this.schema.createTable('google_calendar_connections', (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.string('calendar_id', 255).nullable()
      table.text('refresh_token_encrypted').nullable()
      table.string('status', 24).notNullable().defaultTo('disconnected')
      table.timestamp('last_synced_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.unique(['user_id'])
    })
  }

  async down() {
    this.schema.dropTable('google_calendar_connections')
    this.schema.dropTable('study_sessions')
    this.schema.dropTable('daily_availabilities')
    this.schema.dropTable('review_attempts')
    this.schema.dropTable('concept_links')
    this.schema.dropTable('flashcards')
    this.schema.dropTable('self_tests')
    this.schema.dropTable('concepts')
    this.schema.dropTable('chapters')
    this.schema.dropTable('course_sources')
    this.schema.dropTable('courses')
    this.schema.dropTable('subjects')
  }
}
