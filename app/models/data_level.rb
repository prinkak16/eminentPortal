class DataLevel < CcdmsRecord
  validates :name, presence: true, uniqueness: true
end