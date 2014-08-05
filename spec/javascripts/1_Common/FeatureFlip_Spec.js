describe("Feature Flip (Any)", function() {
	
  it("should get resource value", function() {
    spyOn(Resource.prototype, "get").andReturn('resource_value');

    value = getFlipValue('resource')
    expect(value).toBe('resource_value');
    
    expect(Resource.prototype.get).toHaveBeenCalledWith('/admin/flip/' + 'resource')
  }); 

});

describe("Feature Flip (Boolean)", function() {
	
  it("should return default value when unknown", function() {
    value = getBooleanFlipValue('unknown', true)
    expect(value).toBe(true);
    
    value = getBooleanFlipValue('unknown', false)
    expect(value).toBe(false);
  }); 

  it("should return true when resource is true", function() {
    getFlipValue = jasmine.createSpy('getFlipValue').andReturn('true');
    
    value = getBooleanFlipValue('/true_resource', false)
    expect(value).toBe(true);
  });  

  it("should return false when resource is false", function() {
    getFlipValue = jasmine.createSpy('getFlipValue').andReturn('false');
    
    value = getBooleanFlipValue('/true_resource', true)
    expect(value).toBe(false);
  });    

});

describe("Feature Flip (Number)", function() {
	
  it("should return default value when unknown", function() {
    value = getNumberFlipValue('unknown', 2000)
    
    expect(value).toBe(2000);
  }); 

  it("should return a number when resource is a number", function() {
    getFlipValue = jasmine.createSpy('getFlipValue').andReturn('2000');
    
    value = getNumberFlipValue('/a_number', false)
    expect(value).toBe(2000);
  });

  it("should not return a number when resource is not a number", function() {
    getFlipValue = jasmine.createSpy('getFlipValue').andReturn('2xx');
    
    value = getNumberFlipValue('/not_a_number', 1000)
    expect(value).toBe(1000);
  });  

});