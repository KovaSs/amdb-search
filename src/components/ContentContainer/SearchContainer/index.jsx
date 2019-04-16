import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon } from 'antd';
import "./search-container.scss"

class AdvancedSearchForm extends React.Component {
  state = {
    expand: false,
  };

  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand ? 10 : 6;
    const { getFieldDecorator } = this.props.form;
    const children = [];
    for (let i = 1; i < 10; i++) {
      children.push(
        <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
          <Form.Item label={`Поле ${i}`}>
            {getFieldDecorator(`field-${i}`, {
              rules: [{
                required: true,
                message: 'Обязательное поле для ввода!',
              }],
            })(
              <Input placeholder="placeholder" />
            )}
          </Form.Item>
        </Col>
      );
    }
    return children;
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={24}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">Поиск</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              Очистить
            </Button>
            <Button style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              Расширенный поиск <Icon type={this.state.expand ? 'up' : 'down'} />
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);

class SearchContainer extends Component {
  render() {
    return (
      <div className="search-content">
        <WrappedAdvancedSearchForm/>
        <div className="search-result-list">Search Result List</div>
      </div>
    )
  }
}

export default SearchContainer
