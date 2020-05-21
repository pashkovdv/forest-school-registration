import React, { Component } from "react";
import { Form, DatePicker, Input, Select, Switch, Slider, Col, Row, InputNumber, Button } from "antd";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};

export default class AppContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 4,
    };
  }

  onChange = value => {
    if (isNaN(value)) {
      return;
    }
    this.setState({
      inputValue: value,
    });
  };

  render() {
    const { inputValue } = this.state;

    return (
      <Form
        {...formItemLayout}
      >

        <Form.Item name='fio' label="ФИО" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="date-birth-picker" label="Дата рождения" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>

        <Form.Item name="passport-sn" label="Серия, номер пасспорта" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="passport-issuedby" label="Кем и когда выдан" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address-registration" label="Адрес регистрации" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address-live" label="Адрес проживания" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="social-status"
          label="Соц. статус"
          rules={[{ required: true, message: 'Соц. статус' }]}
        >
          <Select placeholder="555">
            <Select.Option value="bomzh">bomzh</Select.Option>
            <Select.Option value="student">student</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name='fio-parent' label="ФИО родителя/опекуна" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="phone-parent"
          label="тел. родителя/опекуна"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input/>
        </Form.Item>

        <Form.Item name="city" label="Город" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="clss" label="Класс" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="spec" label="Специальность" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="spec-add" label="Доп. специальность" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="switch" label="Окончил школу" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="prof-start" label="Нач. проф." rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="prof-high" label="Высш. проф." rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="prof-middle" label="Сред. проф." rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="cert-sn" label="Аттестат СН" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="date-cert" label="Дата выдачи аттестата" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        
        <Form.Item name="mark-average" label="Средний балл">
          <Row>
            <Col span={20}>
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
                onChange={this.onChange}
                value={typeof inputValue === 'number' ? inputValue : 0}
                step={0.1}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={3}
                max={5}
                style={{ margin: '0 16px' }}
                step={0.1}
                value={inputValue}
                onChange={this.onChange}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item name="hostal" label="Общежитие" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="special" label="Спец. условия" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="special-add" label="Доп. меры соц. под." rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="agree" label="Согласие на обработку" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

      </Form>
    );
  }
}
