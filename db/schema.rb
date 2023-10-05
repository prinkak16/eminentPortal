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

ActiveRecord::Schema[7.0].define(version: 2023_09_21_065453) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "auth_users", force: :cascade do |t|
    t.string "name", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.datetime "rejected_at"
    t.string "rejected_reason"
    t.datetime "verified_at"
    t.datetime "submitted_at"
    t.datetime "approved_at"
    t.jsonb "device_info", default: "{}", null: false
    t.integer "version", default: 3, null: false
    t.boolean "is_selected", default: false, null: false
    t.bigint "selected_by_id"
    t.string "selection_reason"
    t.bigint "delete_by_id"
    t.string "deletion_reason"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_state_id"], name: "index_custom_member_forms_on_country_state_id"
    t.index ["created_by_id"], name: "index_custom_member_forms_on_created_by_id"
    t.index ["delete_by_id"], name: "index_custom_member_forms_on_delete_by_id"
    t.index ["selected_by_id"], name: "index_custom_member_forms_on_selected_by_id"
  end

  create_table "states", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.string "state_code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
