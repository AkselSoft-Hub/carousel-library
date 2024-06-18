import React from "react";
import { Meta, Story } from "@storybook/react";
import Carousel from "../Carousel";

export default {
  title: "Example/Carousel",
  component: Carousel,
} as Meta;

const Template: Story<any> = (args) => (
  <Carousel {...args}>
    <div style={{ backgroundColor: "lightcoral", height: "200px" }}>Card 1</div>
    <div style={{ backgroundColor: "lightblue", height: "200px" }}>Card 2</div>
    <div style={{ backgroundColor: "lightgreen", height: "200px" }}>Card 3</div>
  </Carousel>
);

export const Default = Template.bind({});
Default.args = {
  isInfinite: false,
};

export const Infinite = Template.bind({});
Infinite.args = {
  isInfinite: true,
};
