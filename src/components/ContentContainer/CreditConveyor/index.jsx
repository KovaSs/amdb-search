import React, { Component } from "react";
import { Row, Col, Form, Input, Button } from "antd";
import "./сredit-сonveyor.scss"

class CreditConveyor extends Component {
  state = {
    expand: false,
  };

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("Received values of form: ", values);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  getFields = () => {
    return (
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label={`ИНН`}>
            <Input placeholder="Введите ИНН" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label={`ОГРН`}>
            <Input placeholder="Введите ОГРН" />
          </Form.Item>
        </Col>
        <Col span={6} offset={17}>
          <Button type="primary" htmlType="submit">Поиск</Button>
        </Col>
      </Row>
    )
  }

  render() {
    return (
      <div className="credit-conveyor">
        <Col span={5} style={{ backgroundColor: "rgba(43, 255, 0, 0.24)" }}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            {this.getFields()}
          </Form>
        </Col>
        <Col
          span={19}
          style={{ backgroundColor: "rgba(0, 255, 242, 0.24)" }}
        />
      </div>
    );
  }
}

export default CreditConveyor;
