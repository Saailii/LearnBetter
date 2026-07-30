import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('flashcards', (table) => {
      table
        .integer('course_source_id')
        .unsigned()
        .nullable()
        .references('course_sources.id')
        .onDelete('SET NULL')
      table.index(['course_source_id'], 'flashcards_source_id_index')
      table.index(['concept_id', 'due_at'], 'flashcards_concept_due_index')
    })

    this.schema.alterTable('course_sources', (table) => {
      table.index(['course_id'], 'course_sources_course_id_index')
    })
    this.schema.alterTable('chapters', (table) => {
      table.index(['course_id'], 'chapters_course_id_index')
    })
    this.schema.alterTable('concepts', (table) => {
      table.index(['chapter_id'], 'concepts_chapter_id_index')
    })
    this.schema.alterTable('self_tests', (table) => {
      table.index(['concept_id'], 'self_tests_concept_id_index')
    })
    this.schema.alterTable('review_attempts', (table) => {
      table.index(['flashcard_id'], 'review_attempts_flashcard_id_index')
      table.index(['self_test_id'], 'review_attempts_self_test_id_index')
    })
  }

  async down() {
    this.schema.alterTable('review_attempts', (table) => {
      table.dropIndex(['self_test_id'], 'review_attempts_self_test_id_index')
      table.dropIndex(['flashcard_id'], 'review_attempts_flashcard_id_index')
    })
    this.schema.alterTable('self_tests', (table) => {
      table.dropIndex(['concept_id'], 'self_tests_concept_id_index')
    })
    this.schema.alterTable('concepts', (table) => {
      table.dropIndex(['chapter_id'], 'concepts_chapter_id_index')
    })
    this.schema.alterTable('chapters', (table) => {
      table.dropIndex(['course_id'], 'chapters_course_id_index')
    })
    this.schema.alterTable('course_sources', (table) => {
      table.dropIndex(['course_id'], 'course_sources_course_id_index')
    })
    this.schema.alterTable('flashcards', (table) => {
      table.dropIndex(['concept_id', 'due_at'], 'flashcards_concept_due_index')
      table.dropIndex(['course_source_id'], 'flashcards_source_id_index')
      table.dropColumn('course_source_id')
    })
  }
}
