import * as Yup from 'yup';

export class FormsValidator {
  setForm;
  data;
  schema;
  setFormErros;
  fromErros;
  setValidForm;
  constructor(data, schema, setFormErros, fromErros, setValidForm) {
    this.data = data;
    this.schema = schema;
    this.setFormErros = setFormErros;
    this.fromErros = fromErros;
    this.setValidForm = setValidForm;
  }

  async validateData(name, data) {
    const errosData = this.fromErros;
    const onlyFalse = data ? true : false;
    const dataValidate = data ? data[name] : this.data[name];
    try {
      await Yup.reach(this.schema, name).validate(dataValidate);
      errosData[name] = false;
      this.setFormErros({...errosData});
    } catch (e) {
      if (!onlyFalse) {
        errosData[name] = true;
        this.setFormErros({...errosData});
      }
    }
  }
  async validateForm(data) {
    try {
      await this.schema.validate(data);
      this.setValidForm(false);
    } catch (_e) {
      this.setValidForm(true);
    }
  }
}
