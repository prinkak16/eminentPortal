class CcdmsRecord < ActiveRecord::Base
  self.abstract_class = true
  establish_connection :ccdms
end
