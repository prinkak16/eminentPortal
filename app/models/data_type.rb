class DataType < CcdmsRecord
  validates :name, presence: true, uniqueness: true
end