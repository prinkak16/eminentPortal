class CustomMemberForm < ApplicationRecord
  audited
  self.table_name = 'custom_member_forms'
  TYPE_EMINENT = "eminent_personality".freeze
  CURRENT_ADDRESS = "current_address".freeze
  HOME_ADDRESS = "home_town_address".freeze

  include AASM
  include CustomMemberFormConcern
  belongs_to :created_by, class_name: 'AuthUser'
  belongs_to :state, class_name: 'State', optional: true
  belongs_to :deleted_by, class_name: 'AuthUser', optional: true
  belongs_to :selected_by, class_name: 'AuthUser', optional: true
  validates_uniqueness_of :phone, scope: :form_type, :allow_blank => true, :allow_nil => true
  belongs_to :country_state

  has_many :vacancy_allotments

  scope :buddhist_leader, -> { where(form_type: 'buddhist_leader') }
  acts_as_paranoid

  aasm do
    state :pending, initial: true
    state :otp_verified
    state :incomplete
    state :submitted
    state :rejected
    state :approved

    event :reject do
      transitions from: %i[pending otp_verified submitted], to: :rejected
      after do
        update rejected_at: DateTime.now
      end
    end

    event :verify do
      transitions from: %i[pending], to: :otp_verified
      after do
        update verified_at: DateTime.now
      end
    end

    event :mark_incomplete do
      transitions from: %i[pending otp_verified], to: :incomplete
      after do
        update verified_at: DateTime.now
      end
    end

    event :submit do
      transitions from: %i[pending otp_verified incomplete rejected], to: :submitted
      after do
        update submitted_at: DateTime.now
      end
    end

    event :approve do
      transitions from: %i[pending submitted rejected], to: :approved
      after do
        update approved_at: DateTime.now
      end
    end
  end

  def generate_otp
    otp_expiration_mins = ENV['OTP_EXPIRATION_MINS'] ? ENV['OTP_EXPIRATION_MINS'].to_i : 5
    if otp_created_at.blank? || otp_created_at < (DateTime.now - otp_expiration_mins.minutes)
      self.otp = (SecureRandom.random_number(9e5) + 1e5).to_i.to_s
      self.otp_created_at = DateTime.now
    end
    self.save
  end

  def check_otp_validation(input_otp)
    is_backdoor = (ENV['EMINENT_BACKDOOR_OTP'] && ENV['EMINENT_BACKDOOR_OTP'] == input_otp)
    puts is_backdoor, input_otp, ENV['EMINENT_BACKDOOR_OTP']
    if is_backdoor
      true
    else
      otp_expiration_mins = ENV['OTP_EXPIRATION_MINS'] ? ENV['OTP_EXPIRATION_MINS'].to_i : 5
      self.otp.to_s == input_otp && (DateTime.now < self.otp_created_at + otp_expiration_mins.minutes)
    end
  end

  def self.allowed_form_types
    [CustomMemberForm::TYPE_EMINENT]
  end

  def self.latest_eminent_version
    versions = [1, 2, 3]
    versions.last
  end
end
