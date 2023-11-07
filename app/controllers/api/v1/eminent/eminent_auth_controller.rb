class Api::V1::Eminent::EminentAuthController < BaseApiController
  include CustomMemberFormHelper
  include UtilHelper
  include FilterHelper

  def send_otp
    if params[:phone].blank? || !params[:phone].match?('^[1-9][0-9]{9}$')
      return render json: { success: false, message: 'Please provide a valid phone number.' }, status: :bad_request
    end

    if params[:form_type].blank?
      return render json: { success: false, message: 'You are not authorized to access this form.' }, status: :unauthorized
    end

    custom_member_form = fetch_member(params[:phone], params[:form_type])
    if custom_member_form.nil?
      return render json: { success: false, message: 'No record found with this phone number.' }, status: :unauthorized
    end

    custom_member_form.generate_otp
    send_sms("Your OTP is #{custom_member_form.otp} - BJP SARAL", params[:phone])
    render json: { success: true, message: 'Otp Sent successfully.' }, status: :ok
  end

  def validate_otp
    if params[:phone].blank? || !params[:phone].match?('^[1-9][0-9]{9}$')
      return render json: { success: false, message: 'Phone number can\'t be empty' }, status: :bad_request
    end

    if params[:form_type].blank?
      return render json: { success: false, message: 'You are not authorized to access this form.' }, status: :unauthorized
    end

    if params[:otp].blank?
      return render json: { success: false, message: 'Phone number can\'t be empty' }, status: :bad_request
    end

    custom_member_form = fetch_member(params[:phone], params[:form_type])

    if custom_member_form.nil?
      return render json: { success: false, message: 'No record found with this phone number.' }, status: :unauthorized
    else
      unless custom_member_form.check_otp_validation(params[:otp])
        return render json: { success: false, message: 'OTP verification failed. Please try again.' }, status: :bad_request
      end

      require 'bcrypt'
      encrypted_key = BCrypt::Password.create("#{params[:phone]}-#{params[:otp]}")
      custom_member_form.token = encrypted_key

      if custom_member_form.save
        return render json: { success: true, auth_token: encrypted_key, id: custom_member_form.id, name: custom_member_form.data['name'] || '', is_view: custom_member_form.aasm_state == 'approved' }, status: :ok
      else
        return render json: { success: false, message: 'OTP verification failed. Please try again.' }, status: :bad_request
      end
    end
  end
end
