/* @flow */
import React, { Component } from "react";
import { Text } from "react-native";
import getFontStyle from "./getFontStyle"; // eslint-disable-line import/no-unresolved

export { getFontStyle };

/**
 * Usage:
 *
 * <LText>123</LText>
 * <LText bold>toto</LText>
 * <LText semiBold>foobar</LText>
 * <LText secondary>alternate font</LText>
 * <LText tertiary>tertiary font</LText>
 * <LText style={styles.text}>some specific styles</LText>
 */
export default class LText extends Component<*> {
  render() {
    const {
      bold,
      semiBold,
      secondary,
      tertiary,
      style,
      ...newProps
    } = this.props;
    return (
      <Text
        {...newProps}
        style={[style, getFontStyle({ bold, semiBold, secondary, tertiary })]}
      />
    );
  }
}
