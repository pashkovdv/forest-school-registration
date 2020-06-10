import React, { Component } from "react";
import './AppContent.css';
import { Form, DatePicker, Input, Select, Switch, Slider, Upload, InputNumber, Button, Card } from "antd";
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import { GoogleSpreadsheet } from "google-spreadsheet";

const creds = require('../acceptanceofapplications-7d9765a0ac62.json');

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 12,
  },
};

//const HOST = 'http://localhost';
const HOST = 'http://fs.hostronavt.ru';
const ACTION_URL = HOST + '/up.php';

const spec = {
  "Петрозаводск": {
    "9": [
      ['Механики', 'МХ 11'],
      ['Электрики', 'ЭЛ 12'],
      ['Технология лесозаготовок', 'ЛЗ 13'],
      ['Технология деревообработки', 'ТЛ 14'],
      ['Лесопарковое хозяйство', 'ЛХ 15'],
      ['Пожарная безопасность', 'ПБ 19'],
      ['Природоохрана', 'ПТ'],
      ['Защита в ЧС (платно)', 'ЗЧС'],
    ],
    "11": [
      ['Садово-парковое строительство (платно)', 'СП (11 класс)'],
      ['Технология деревообработки (платно)', 'ТЛ (11 класс)'],
      ['Лесопарковое хозяйство (платно)', 'ЛХ (11 класс)'],
    ],
  },
  "Кондопога": {
    "9": [
      ['Техник-механик', 'ТМ'],
      ['Электромонтер', 'Электромонтер'],
      ['Продавец. Контролер-кассир', 'ПК'],
      ['Сварщик', 'СМС'],
    ],
    "11": [
      ['Техник-механик (платно)', 'ТМ (11 класс)'],
    ],
  }
}

function prepareData(values) {
  console.log({values})

  values['Согласие на обработку'] = 'Получено';
  values['ID в боте'] = 'Сайт';
  values['Дата'] = moment().toISOString();
  values['Средний балл'] = values['Средний балл'] ? values['Средний балл'].toString() : '3' ;
  values['Паспорт СН'] = values['Паспорт СН'].replace( / / , '' );

  for ( let key in values ) {
    if ( moment.isMoment(values[key]) )  {
      values[key] = values[key].format('DD.MM.YYYY');
    };
  };

  for ( let key in values ) {
    if ( typeof values[key] === 'object' )  {
      values[key] = HOST + "/files/" + values[key][ values[key].length - 1 ].response.files[0].name
    };
  };

}

async function sendData(values) {

  prepareData(values);

  const doc = new GoogleSpreadsheet('1xT6ZN8MGXoxaFQCHsJWHAihMGPXz8xkgeNq8hzBob34');
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow(values);

  const specSheetName = spec[values['Город']][values['Класс']].find( val => val[0] = values['Специальность'] )[1]
  for ( let i = 0 ; i < doc.sheetCount ; i++ ) {
    if ( doc.sheetsByIndex[i].title === specSheetName ) {
      const sheet = doc.sheetsByIndex[i];
      await sheet.addRow(values);
    };
  };

}

export default class AppContent extends Component {

  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      inputValue: 3.0,
      personalAgree: false,
      allOk: false,
      city: undefined,
      cls: undefined,
      firstSpec: undefined,
      secondSpec: undefined,
      pass2_3_enabled: true,
      pass5_6_enabled: true,
      diplom_enabled: true,
      diplom_average_enabled: true,
    };
  }
  
  setAgree = ( val ) => {
    this.setState({
      personalAgree: true,
    })
    return val;
  }

  onChangeSlider = value => {
    if (isNaN(value)) {
      return;
    }
    this.setState({
      inputValue: value,
    });
  };

  clearSpec = () => {
    this.formRef.current.resetFields(['Специальность']);
    this.formRef.current.resetFields(['Доп. специальность']);
  }

  cityChange = (val) => {
    this.setState({
      city: val,
    });
    this.clearSpec();
    return val;
  }

  classChange = (val) => {
    this.setState({
      cls: val,
    });
    this.clearSpec();
    return val;
  }
  
  firstSpecChange = (val) => {
    this.setState({
      firstSpec: val,
    });
    return val;
  }

  secondSpecChange = (val) => {
    this.setState({
      secondSpec: val,
    });
    return val;
  }

  onFinish = values => {
    sendData(values);
    this.setState({
      allOk: true,
      showModal: true,
    });
  };

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {

    return (
      <div>
        { !this.state.personalAgree &&
          <Card>
            При заполнении формы вам необходимо будет отправить нам фотографии паспорта и документа об образовании. Не бойтесь отправить фото или сканы. Ваши данные не будут доступны третьим лицам. Это тоже самое, что и отправка документов по электронной почте. Заявление на прием будет сформировано автоматически. Но форму нужно заполнить до конца и нажать кнопку “Отправить”. Это чуть более 20 вопросов и менее 10 минут вашего времени. Для начала жмите "даю согласие".
          </Card>
        }
        { this.state.allOk &&
          <Card
            title = "Поздравляем, вы успешно подали документы!"
            style = {{ width: 600 }}
          >
            <p>
              Для того чтобы Вас зачислили, нужно подать УВЕДОМЛЕНИЕ О НАМЕРЕНИИ ОБУЧАТЬСЯ. Это уведомление временно заменит подачу оригинала аттестата.
              Сроки и условия предоставления уведомления смотрите в июле на сайте или в группе vk.com/priempltt
            </p>
            <p>
              Если вы выбрали специальность, по которой сдается вступительный экзамен, то скоро мы позвоним, чтобы записать вас на него. Будьте на связи!
              <ul>
                <li>Пожарная безопасность</li>
                <li>Защита в ЧС</li>
                <li>Садово-парковое строительство</li>
              </ul>
            </p>
          </Card>
        }
        { !this.state.allOk &&
          <Form
            {...formItemLayout}
            onFinish = { this.onFinish }
            scrollToFirstError = {true}
            ref={this.formRef}
          >
            <Form.Item
              name="Согласие на обработку"
              label="Я даю согласие на обработку персональных данных"
              valuePropName="checked"
              getValueFromEvent = { this.setAgree }
            >
              <Switch
                disabled = { this.state.personalAgree }
                checkedChildren="Получено"
                unCheckedChildren="Нажмите тут чтобы дать согласие"
              />
            </Form.Item>

            { this.state.personalAgree &&
            <div>
              <Form.Item
                name="Город"
                label="В какой город будете поступать?"
                rules={[{ required: true }]}
                getValueFromEvent = {this.cityChange}
              >
                <Select>
                  <Select.Option value="Петрозаводск">Петрозаводск</Select.Option>
                  <Select.Option value="Кондопога">Кондопога</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="Класс"
                label="Поступаете после 9-го класса или после 11-го?"
                rules={[{ required: true }]}
                getValueFromEvent = {this.classChange}
              >
                <Select>
                  <Select.Option value="9">После 9-го</Select.Option>
                  <Select.Option value="11">После 11-го</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="Специальность"
                label="На какую основную специальность подаете документы?"
                rules={[{ required: true }]}
                getValueFromEvent = {this.firstSpecChange}
              >
                <Select
                  placeholder = 'Чтобы выбирать специальность, выберите город и класс'
                >
                  { this.state.city && this.state.cls &&
                    spec[this.state.city][this.state.cls]
                    .filter( val => val[0] !== this.state.secondSpec )
                    .map( (val) => 
                      <Select.Option value = {val[0]} >
                        {val[0]}
                      </Select.Option>
                    )
                  }
                </Select>
              </Form.Item>

              { this.state.city && this.state.cls &&
                !( this.state.city === "Кондопога" && this.state.cls === "После 11-го" ) &&
                <Form.Item
                  name="Доп. специальность"
                  label="Дополнительная специальность"
                  getValueFromEvent = {this.secondSpecChange}
                >
                  <Select
                    placeholder = 'Чтобы выбирать доп.специальность, выберите основную'
                  >
                    { this.state.city && this.state.cls &&
                      spec[this.state.city][this.state.cls]
                      .filter( val => val[0] !== this.state.firstSpec )
                      .map( (val) => 
                        <Select.Option value = {val[0]} >
                          {val[0]}
                        </Select.Option>
                      )
                    }
                  </Select>
                </Form.Item>
              }

              <Form.Item
                name='ФИО'
                label="ФИО"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="ДР"
                label="Дата рождения"
                rules={[{ required: true }]}
              >
                <DatePicker />
              </Form.Item>

              <Form.Item
                name="Паспорт СН"
                label="Серия, номер паспорта"
                rules={[{
                  required: true,
                  pattern: /^\d{4} \d{6}$/,
                  message: 'Серия из 4х цифр, потом пробел, потом номер из 6ти цифр'
                }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Паспорт кем и когда выдан"
                label="Кем и когда выдан паспорт"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="pass2_3"
                label="Пришлите фото или скан разворота паспорта с фотографией (2-3 страницы)"
                valuePropName="fileList"
                getValueFromEvent = {this.normFile}
                rules = {[{ required: true }]}
              >
                <Upload
                  name="files"
                  action = {ACTION_URL}
                  listType="picture"
                  beforeUpload = { () => this.setState({ pass2_3_enabled: false }) }
                  onRemove = { () => this.setState({ pass2_3_enabled: true }) }
                >
                  { this.state.pass2_3_enabled &&
                    <Button>
                      <UploadOutlined /> Нажмите, чтобы прикрепить
                    </Button>
                  }
                </Upload>
              </Form.Item>

              <Form.Item
                name="Адрес регистрации"
                label="Адрес регистрации (индекс, город, улица, дом, квартира)"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Адрес проживания"
                label="Адрес проживания. Если совпадает с адресом регистрации, то просто напишите 'Совпадает'"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="pass5_6"
                label="Пришлите фото или скан страницы паспорта с данными о прописке (5 или 6 страницы)"
                valuePropName="fileList"
                getValueFromEvent = {this.normFile}
                rules = {[{ required: true }]}
              >
                <Upload
                  name="files"
                  action = {ACTION_URL}
                  listType = "picture"
                  beforeUpload = { () => this.setState({ pass5_6_enabled: false }) }
                  onRemove = { () => this.setState({ pass5_6_enabled: true }) }
                >
                  { this.state.pass5_6_enabled &&
                    <Button>
                      <UploadOutlined />Нажмите, чтобы прикрепить
                    </Button>
                  }
                </Upload>
              </Form.Item>

              <Form.Item
                name="E-mail"
                label="E-mail"
                rules={[
                  {
                    type: 'email',
                    message: 'Введите корректный E-mail!',
                  },
                  {
                    required: true,
                    message: 'Пожалуйста, введите E-mail!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Телефон"
                label="Телефон"
                rules={[{ required: true, message: 'Пожалуйста, введите номер телефона!' }]}
              >
                <Input/>
              </Form.Item>

              <Form.Item
                name="Соц. статус"
                label="Социальный статус"
                rules={[{ required: true, message: 'Соц. статус' }]}
              >
                <Select>
                  <Select.Option value="Полная семья">Полная семья</Select.Option>
                  <Select.Option value="1 родитель">1 родитель</Select.Option>
                  <Select.Option value="Есть опекун">Есть опекун</Select.Option>
                  <Select.Option value="Сирота">Сирота</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name='ФИО родителя/опекуна'
                label="ФИО родителя/опекуна"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Тел. род/опек"
                label="Телефон родителя/опекуна"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input/>
              </Form.Item>

              <Form.Item
                name="Окончил школу"
                label="Год окончания школы"
                rules={[{
                  required: true,
                  pattern: /^(19|20)\d{2}$/,
                  message: 'Год: только четыре цифры'
                }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Нач. проф."
                label="Получали ли начальное профессиональное образование?"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Да">Да</Select.Option>
                  <Select.Option value="Нет">Нет</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="Высш. проф."
                label="Получали ли высшее профессиональное образование?"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Да">Да</Select.Option>
                  <Select.Option value="Нет">Нет</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="Сред. проф."
                label="Среднее профессиональное образование получаете впервые?"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="впервые">впервые</Select.Option>
                  <Select.Option value="не впервые">не впервые</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="Аттестат СН"
                label="Серия и номер аттестата/диплома"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Дата выдачи А"
                label="Дата выдачи аттестата"
                rules={[{ required: true }]}
              >
                <DatePicker />
              </Form.Item>
              
              <Form.Item
                name="diplom"
                label="Пришлите фото аттестата/диплома (данные которого вы указывали ранее)"
                valuePropName="fileList"
                getValueFromEvent = {this.normFile}
                rules = {[{ required: true }]}
              >
                <Upload
                  name="files"
                  action = {ACTION_URL}
                  listType="picture"
                  beforeUpload = { () => this.setState({ diplom_enabled: false }) }
                  onRemove = { () => this.setState({ diplom_enabled: true }) }
                >
                  { this.state.diplom_enabled &&
                    <Button>
                      <UploadOutlined /> Нажмите, чтобы прикрепить
                    </Button>
                  }
                </Upload>
              </Form.Item>

              <Form.Item
                name="Средний балл"
                label="Средний балл аттестата"
              >
                <Slider
                  marks={{
                    3: '3',
                    3.5: '3.5',
                    4: '4',
                    4.5: '4.5',
                    5: '5',
                  }}
                  min={3}
                  max={5}
                  onChange = {this.onChangeSlider}
                  defaultValue = {this.state.inputValue}
                  value = { typeof this.state.inputValue === 'number' ? this.state.inputValue : 0 }
                  step={0.1}
                />
                <InputNumber
                  min={3}
                  max={5}
                  style={{ margin: '0 16px' }}
                  step={0.1}
                  value = {this.state.inputValue}
                  onChange = {this.onChangeSlider}
                />
                {'<= точное значение можно ввести в этом окне'}
              </Form.Item>

              <Form.Item
                name="diplom_average"
                label = 'Пришлите фото приложения с оценками аттестата/диплома (средний балл которого вы указывали ранее)'
                style = {{ color:'red', height: "60px" }}
                valuePropName="fileList"
                getValueFromEvent = {this.normFile}
                rules = {[{ required: true }]}
              >
                <Upload
                  name="files"
                  action = {ACTION_URL}
                  listType="picture"
                  beforeUpload = { () => this.setState({ diplom_average_enabled: false }) }
                  onRemove = { () => this.setState({ diplom_average_enabled: true }) }
                >
                  { this.state.diplom_average_enabled &&
                    <Button>
                      <UploadOutlined /> Нажмите, чтобы прикрепить
                    </Button>
                  }
                </Upload>
              </Form.Item>

              <Form.Item
                name="Общежитие"
                label="Нуждаетесь ли в общежитии на период обучения?"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Нуждаюсь">Нуждаюсь</Select.Option>
                  <Select.Option value="Не нуждаюсь">Не нуждаюсь</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="Спец. условия"
                label="Нуждаетесь ли в создании специальных условий при проведении вступительных экзаменов?"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Нуждаюсь">Нуждаюсь</Select.Option>
                  <Select.Option value="Не нуждаюсь">Не нуждаюсь</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="Доп меры соц. под."
                label="Нуждаетесь ли в мерах социальной поддержки на период обучения?"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Нуждаюсь">Нуждаюсь</Select.Option>
                  <Select.Option value="Не нуждаюсь">Не нуждаюсь</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  span: 12,
                  offset: 6,
                }}
              >
                <Button type="primary" htmlType="submit" >
                  Отправить
                </Button>
              </Form.Item>
            </div>
            }
          </Form>
        }
      </div>
    );
  }
}