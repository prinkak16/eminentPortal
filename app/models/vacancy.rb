class Vacancy < ApplicationRecord
  acts_as_paranoid
  include AASM

  # is_appointed: pending, appointed, outside_saral
  # allotment_status: vacant, occupied
  # slotting_status: unslotted, slotted, outside_saral

  scope :name_similar, ->(search) {
    select('id', 'designation', "word_similarity(designation, '#{search}') AS ms")
      .where('designation % :designation', designation: search)
      .order(ms: :desc)
  }

  belongs_to :ministry, class_name: 'Ministry', optional: true
  belongs_to :department, class_name: 'Department', optional: true
  belongs_to :organization, class_name: 'Organization', optional: true
  belongs_to :country_state, class_name: 'CountryState', optional: true
  has_many :vacancy_allotments, dependent: :destroy

  aasm(:allotment_status, column: 'allotment_status') do
    state :vacant, initial: true
    state :occupied

    event :assign do
      transitions from: [:vacant], to: :occupied
      after do
        update updated_at: DateTime.now
      end
    end

    event :unassign do
      transitions from: [:occupied], to: :vacant
      after do
        update updated_at: DateTime.now
      end
    end
  end

  aasm(:is_appointed, column: 'is_appointed') do
    state :pending, initial: true
    state :appointed
    state :outside_saral
  end

  aasm(:slotting_status, column: 'slotting_status') do
    state :unslotted, initial: true
    state :slotted
    state :outside_saral

    event :slot do
      transitions from: [:unslotted], to: :slotted
      after do
        update slotted_at: DateTime.now
        update updated_at: DateTime.now
      end
    end

    event :unslot do
      transitions from: [:slotted, :outside_saral], to: :unslotted
      after do
        update slotting_remarks: ''
        update country_state_id: nil
        update slotted_at: DateTime.now
        update updated_at: DateTime.now
      end
    end

    event :already_slotted do
      transitions from: [:unslotted, :slotted], to: :outside_saral
      after do
        update slotted_at: DateTime.now
      end
    end
  end


end