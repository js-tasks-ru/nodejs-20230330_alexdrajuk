const Validator = require('../Validator');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    const sandbox = sinon.createSandbox();

    afterEach(()=> {
      sandbox.restore();
    });

    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      sandbox.spy(validator);

      validator.validate({ name: 'Lalala' });
      validator.validate({ name: 'LooooooooooooooooooongName' });
      validator.validate({ name: 42 });
      validator.validate({ name: 'Vasily Pupkin' });

      const shortNameCall = validator.validate.getCall(0).returnValue;
      expect(shortNameCall).to.have.length(1);
      expect(shortNameCall[0]).to.have.property('field').and.to.be.equal('name');
      expect(shortNameCall[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');

      const longNameCall = validator.validate.getCall(1).returnValue;
      expect(longNameCall).to.have.length(1);
      expect(longNameCall[0]).to.have.property('field').and.to.be.equal('name');
      expect(longNameCall[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 26');

      const wrongNameTypeCall = validator.validate.getCall(2).returnValue;
      expect(wrongNameTypeCall).to.have.length(1);
      expect(wrongNameTypeCall[0]).to.have.property('field').and.to.be.equal('name');
      expect(wrongNameTypeCall[0]).to.have.property('error').and.to.be.equal('expect string, got number');

      const validNameCall = validator.validate.getCall(3).returnValue;
      expect(validNameCall).to.have.length(0);
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      sinon.spy(validator);

      validator.validate({ age: 25 });
      validator.validate({ age: 17 });
      validator.validate({ age: 28 });
      validator.validate({ age: '10' });

      const validAgeCall = validator.validate.getCall(0).returnValue;
      expect(validAgeCall).to.have.length(0);

      const smallAgeCall = validator.validate.getCall(1).returnValue;
      expect(smallAgeCall).to.have.length(1);
      expect(smallAgeCall[0]).to.have.property('field').and.to.be.equal('age');
      expect(smallAgeCall[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');

      const bigAgeCall = validator.validate.getCall(2).returnValue;
      expect(bigAgeCall).to.have.length(1);
      expect(bigAgeCall[0]).to.have.property('field').and.to.be.equal('age');
      expect(bigAgeCall[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 28');

      const wrongAgeType = validator.validate.getCall(3).returnValue;
      expect(wrongAgeType).to.have.length(1);
      expect(wrongAgeType[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });
  });
});
