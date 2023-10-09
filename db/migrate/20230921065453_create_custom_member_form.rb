class CreateCustomMemberForm < ActiveRecord::Migration[7.0]
  def change
    create_table :custom_member_forms do |t|
      t.jsonb :data, null: false, default: '{}'
      t.string :form_type, null: false, default: 'eminent_personality'
      t.bigint :created_by_id, foreign_key: {to_table: :auth_users}, index: true
      t.integer :country_state_id, foreign_key: {to_table: :states}, index: true
      t.string :remark
      t.string :phone, null: false, unique: true
      t.integer :otp
      t.datetime :otp_created_at, default: nil
      t.string :token
      t.string :aasm_state
      t.datetime :rejected_at, default: nil
      t.string :rejected_reason
      t.datetime :verified_at, default: nil
      t.datetime :submitted_at, default: nil
      t.datetime :approved_at, default: nil
      t.jsonb :device_info, null: false, default: '{}'
      t.integer :version, null: false, default: 3
      t.string :channel, default: nil
      t.boolean :is_selected, null: false, default: false
      t.bigint :selected_by_id, foreign_key: {to_table: :auth_users}, index: true, default: nil
      t.string :selection_reason
      t.bigint :delete_by_id, foreign_key: {to_table: :auth_users}, index: true, default: nil
      t.string :deletion_reason
      t.datetime :deleted_at, default: nil
      t.timestamps
    end
  end
end