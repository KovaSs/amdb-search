import React, { Component } from 'react'
import { Steps } from 'antd';
import "./steps-container.scss";

export class StepsContainer extends Component {
  render() {
    const Step = Steps.Step;
    return (
    <Steps current={0}>
      <Step title="Шаг 1" />
      <Step title="Шаг 2" />
      <Step title="Шаг 3" />
    </Steps>
    )
  }
}

export default StepsContainer

