// @flow

import React, { PureComponent } from "react";
import { BigNumber } from "bignumber.js";
import { View, StyleSheet } from "react-native";

import type { Unit } from "@ledgerhq/live-common/lib/types";

import LText from "../components/LText";
import CurrencyUnitValue from "../components/CurrencyUnitValue";
import IconArrowUp from "../images/icons/ArrowUp";
import IconArrowDown from "../images/icons/ArrowDown";

import colors from "../colors";

type Props = {
  from: BigNumber,
  to: BigNumber,
  percent?: boolean,
  unit?: Unit,
};

const arrowUp = <IconArrowUp size={12} color={colors.success} />;
const arrowDown = <IconArrowDown size={12} color={colors.alert} />;

export default class Delta extends PureComponent<Props> {
  render() {
    const { from, to, percent, unit } = this.props;

    let delta = percent
      ? to
          .minus(from)
          .dividedBy(from)
          .multipliedBy(100)
      : to.minus(from);

    if (delta.isNaN()) {
      delta = BigNumber(0);
    }
    return (
      <View style={styles.root}>
        {delta.isGreaterThanOrEqualTo(0) ? arrowUp : arrowDown}
        <View style={styles.content}>
          <LText tertiary style={styles.text}>
            {unit ? (
              <CurrencyUnitValue unit={unit} value={delta} />
            ) : percent ? (
              `${delta.toFixed(0)}%`
            ) : null}
          </LText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginLeft: 5,
  },
  text: {
    fontSize: 16,
    color: colors.darkBlue,
  },
});
