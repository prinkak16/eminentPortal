class PersonCategory < CcdmsRecord
  self.table_name = 'person_categories'
  def self.abstract_categories
    PersonCategory.where(name: ['GEN', 'OBC', 'SC', 'ST', 'Minority']).select(:name, :id).order('created_at ASC')
  end
end