# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_12_14_105335) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_trgm"
  enable_extension "plpgsql"

  create_table "audits", force: :cascade do |t|
    t.integer "auditable_id"
    t.string "auditable_type"
    t.integer "associated_id"
    t.string "associated_type"
    t.integer "user_id"
    t.string "user_type"
    t.string "username"
    t.string "action"
    t.text "audited_changes"
    t.integer "version", default: 0
    t.string "comment"
    t.string "remote_address"
    t.string "request_uuid"
    t.datetime "created_at"
    t.index ["associated_type", "associated_id"], name: "associated_index"
    t.index ["auditable_type", "auditable_id", "version"], name: "auditable_index"
    t.index ["created_at"], name: "index_audits_on_created_at"
    t.index ["request_uuid"], name: "index_audits_on_request_uuid"
    t.index ["user_id", "user_type"], name: "user_index"
  end

  create_table "auth_users", force: :cascade do |t|
    t.string "name", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "phone_number"
    t.integer "assist_to_id"
    t.datetime "deleted_at"
    t.boolean "is_admin", default: false
    t.index ["name"], name: "index_user_name_search", opclass: :gin_trgm_ops, using: :gin
  end

  create_table "custom_member_forms", force: :cascade do |t|
    t.jsonb "data", default: "{}", null: false
    t.string "form_type", default: "eminent_personality", null: false
    t.bigint "created_by_id"
    t.integer "country_state_id"
    t.string "remark"
    t.string "phone", null: false
    t.integer "otp"
    t.datetime "otp_created_at"
    t.string "token"
    t.string "aasm_state"
    t.bigint "rejected_by_id"
    t.datetime "rejected_at"
    t.string "rejected_reason"
    t.datetime "verified_at"
    t.datetime "submitted_at"
    t.bigint "approved_by_id"
    t.datetime "approved_at"
    t.jsonb "device_info", default: "{}", null: false
    t.integer "version", default: 3, null: false
    t.string "channel"
    t.boolean "is_selected", default: false, null: false
    t.bigint "selected_by_id"
    t.string "selection_reason"
    t.bigint "deleted_by_id"
    t.string "deletion_reason"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "eminent_updated_at"
    t.datetime "office_updated_at"
    t.index ["approved_by_id"], name: "index_custom_member_forms_on_approved_by_id"
    t.index ["country_state_id"], name: "index_custom_member_forms_on_country_state_id"
    t.index ["created_by_id"], name: "index_custom_member_forms_on_created_by_id"
    t.index ["deleted_by_id"], name: "index_custom_member_forms_on_deleted_by_id"
    t.index ["rejected_by_id"], name: "index_custom_member_forms_on_rejected_by_id"
    t.index ["selected_by_id"], name: "index_custom_member_forms_on_selected_by_id"
  end

  create_table "departments", force: :cascade do |t|
    t.integer "ministry_id"
    t.string "name", null: false
    t.string "slug", null: false
    t.integer "order_id", default: 1, null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ministry_id"], name: "index_departments_on_ministry_id"
    t.index ["name"], name: "index_department_name_search", opclass: :gin_trgm_ops, using: :gin
    t.index ["name"], name: "index_departments_on_name"
    t.index ["slug"], name: "index_departments_on_slug"
  end

  create_table "file_status", force: :cascade do |t|
    t.integer "vacancy_allotment_id"
    t.bigint "action_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "file_status_level_id"
    t.string "description"
    t.index ["action_by_id"], name: "index_file_status_on_action_by_id"
    t.index ["vacancy_allotment_id"], name: "index_file_status_on_vacancy_allotment_id"
  end

  create_table "file_status_activities", force: :cascade do |t|
    t.integer "file_status_id"
    t.bigint "vacancy_allotment_id", null: false
    t.bigint "file_status_level_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "description"
    t.index ["file_status_level_id"], name: "index_file_status_activities_on_file_status_level_id"
    t.index ["vacancy_allotment_id"], name: "index_file_status_activities_on_vacancy_allotment_id"
  end

  create_table "file_status_levels", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "state"
  end

  create_table "ministries", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.integer "order_id", default: 1, null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_ministries_on_name"
    t.index ["name"], name: "index_ministry_name_search", opclass: :gin_trgm_ops, using: :gin
    t.index ["slug"], name: "index_ministries_on_slug"
  end

  create_table "organizations", force: :cascade do |t|
    t.integer "parent_id"
    t.integer "order_id", default: 1, null: false
    t.integer "country_state_id"
    t.integer "ministry_id"
    t.integer "department_id"
    t.string "type"
    t.string "ratna_type"
    t.boolean "is_listed", default: false
    t.string "name", null: false
    t.string "slug", null: false
    t.string "abbreviation"
    t.jsonb "location", default: "{}", null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_state_id"], name: "index_organizations_on_country_state_id"
    t.index ["department_id"], name: "index_organizations_on_department_id"
    t.index ["ministry_id"], name: "index_organizations_on_ministry_id"
    t.index ["name"], name: "index_organization_name_search", opclass: :gin_trgm_ops, using: :gin
    t.index ["name"], name: "index_organizations_on_name"
    t.index ["slug"], name: "index_organizations_on_slug"
  end

  create_table "states", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.string "state_code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_ministries", force: :cascade do |t|
    t.integer "user_id"
    t.integer "ministry_id"
    t.boolean "is_minister", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ministry_id"], name: "index_user_ministries_on_ministry_id"
    t.index ["user_id"], name: "index_user_ministries_on_user_id"
  end

  create_table "vacancies", force: :cascade do |t|
    t.integer "ministry_id"
    t.integer "department_id"
    t.integer "organization_id"
    t.integer "country_state_id"
    t.string "designation", default: "", null: false
    t.string "is_appointed", default: "pending", null: false
    t.datetime "tenure_started_at"
    t.datetime "tenure_ended_at"
    t.datetime "appointed_at"
    t.string "allotment_status", default: "vacant", null: false
    t.datetime "allotted_at"
    t.string "slotting_status", default: "unslotted", null: false
    t.string "slotting_remarks", default: ""
    t.datetime "slotted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.string "allotment_remark"
    t.index ["country_state_id"], name: "index_vacancies_on_country_state_id"
    t.index ["department_id"], name: "index_vacancies_on_department_id"
    t.index ["ministry_id"], name: "index_vacancies_on_ministry_id"
    t.index ["organization_id"], name: "index_vacancies_on_organization_id"
  end

  create_table "vacancy_allotments", force: :cascade do |t|
    t.integer "vacancy_id"
    t.integer "custom_member_form_id"
    t.string "remarks", default: ""
    t.integer "file_status_id"
    t.datetime "unoccupied_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["custom_member_form_id"], name: "index_vacancy_allotments_on_custom_member_form_id"
    t.index ["vacancy_id"], name: "index_vacancy_allotments_on_vacancy_id"
  end

  add_foreign_key "file_status_activities", "file_status_levels"
  add_foreign_key "file_status_activities", "vacancy_allotments"
end
