class User < ApplicationRecord
    validates :username, :session_token, presence: true, uniqueness: true
    validates :password, length: {minimum: 6, allow_nil: true}
    validates :description, length: {maximum: 400, allow_nil: true}

    attr_reader :password

    after_initialize :ensure_session_token

    has_one_attached :profile_photo
    validates :profile_photo, content_type: ['image/jpg', 'image/png', 'image/jpeg']

    has_one_attached :profile_background
     validates :profile_background, content_type: ['image/jpg', 'image/png', 'image/jpeg']


    has_many :songs,
        primary_key: :username,
        foreign_key: :username,
        class_name: :Song,
        dependent: :destroy
        


    has_many :liked_songs,
        primary_key: :id,
        foreign_key: :user_id,
        class_name: :Like
   



    has_many :followers,
        primary_key: :id,
        foreign_key: :user_id,
        class_name: :Follower

    has_many :following,
        primary_key: :id,
        foreign_key: :follower,
        class_name: :Follower

    def self.find_by_credentials(username,password)
        user = User.find_by(username: username)
        return nil if user.nil?
        user.is_password?(password) ? user : nil
    end

    def password=(password)
        @password = password
        self.password_digest = BCrypt::Password.create(password)
    end

    def is_password?(password)
        BCrypt::Password.new(self.password_digest).is_password?(password)
    end

    def reset_session_token!
        self.session_token = SecureRandom.urlsafe_base64
        self.save!
        self.session_token
    end
    private

    def ensure_session_token
        self.session_token ||= SecureRandom.urlsafe_base64
    end
end
