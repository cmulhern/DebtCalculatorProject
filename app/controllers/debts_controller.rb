class DebtsController < ApplicationController
  def index
    
  end
  def new
    
  end
  
  def create
    months = 0
    interest = 0.00
    params.each do |key, val|      
      if /debt/ =~ key
        puts key
        rate = (params[key][:interest].to_d)/100
        principle = params[key][:amount].to_d
        payment = params[key][:payment].to_d
        num = Math.log(1-((principle/payment)*(rate/12)))
        denom = Math.log(1+(rate/12))
        duration = -(num/denom)
        months = [months, duration.ceil].max   
        interest = interest + ((payment * duration) - principle)
      end   
    end
    date = Date.today + months.months
    @month = Date::MONTHNAMES[date.month] 
    @year = date.year
    @interest = interest.round
    render :layout => false
  end
  
end