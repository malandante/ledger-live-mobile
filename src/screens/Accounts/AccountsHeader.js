// @flow

import React, { PureComponent } from "react";
import { Animated, StyleSheet } from "react-native";

import AnimatedLText from "../../components/LText/AnimatedLText";

export default class AnimatedHeader extends PureComponent<{
  scrollY: Animated.Value,
}> {
  render() {
    const { scrollY } = this.props;
    const headerTx = [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 90],
          outputRange: [0, -90],
          extrapolate: "clamp",
        }),
      },
      {
        scale: scrollY.interpolate({
          inputRange: [-200, 0],
          outputRange: [1.5, 1],
          extrapolate: "clamp",
        }),
      },
    ];

    const textTx = [
      {
        scale: scrollY.interpolate({
          inputRange: [0, 90],
          outputRange: [1, 0.5],
          extrapolate: "clamp",
        }),
      },

      {
        translateY: scrollY.interpolate({
          inputRange: [0, 90],
          outputRange: [0, 15],
          extrapolate: "clamp",
        }),
      },
    ];
    return (
      <Animated.View style={[styles.header, { transform: headerTx }]}>
        <AnimatedLText style={[styles.headerText, { transform: textTx }]}>
          {"Accounts"}
        </AnimatedLText>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  headerText: {
    color: "black",
    fontSize: 30,
  },
});
