// @flow

import React, { Component } from "react";
import { View, StyleSheet, FlatList, Animated } from "react-native";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { accountsSelector } from "../../reducers/accounts";
import GenerateMockAccountsButton from "../../components/GenerateMockAccountsButton";
import ImportAccountsButton from "../../components/ImportAccountsButton";
import AccountsIcon from "../../images/icons/Accounts";
import provideSyncRefreshControl from "../../components/provideSyncRefreshControl";

import AccountCard from "./AccountCard";
import AccountsHeader from "./AccountsHeader";

const List = provideSyncRefreshControl(
  Animated.createAnimatedComponent(FlatList),
);

const navigationOptions = {
  tabBarIcon: ({ tintColor }: { tintColor: string }) => (
    <AccountsIcon size={18} color={tintColor} />
  ),
};

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
});

type Props = {
  navigation: *,
  accounts: Account[],
};
class Accounts extends Component<Props, { scrollY: Animated.Value }> {
  static navigationOptions = navigationOptions;

  state = {
    scrollY: new Animated.Value(0),
  };

  onAddMockAccount = () => {};

  renderItem = ({ item, index }: { item: Account, index: number }) => (
    <AccountCard
      account={item}
      onPress={() =>
        this.props.navigation.navigate("Account", {
          accountId: item.id,
        })
      }
      style={[styles.accountItem, index === 0 && styles.accountItemFirst]}
    />
  );

  keyExtractor = item => item.id;

  render() {
    const { accounts } = this.props;
    const { scrollY } = this.state;

    if (accounts.length === 0) {
      return (
        <View style={{ padding: 40 }}>
          <GenerateMockAccountsButton title="Generate Mock Accounts" />
          <View style={{ height: 10 }} />
          {/* $FlowFixMe */}
          <ImportAccountsButton title="Import Accounts" />
        </View>
      );
    }

    // FIXME drop the animated header. it's not actually animated!

    return (
      <View style={styles.root}>
        <List
          data={accounts}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: this.state.scrollY,
                  },
                },
              },
            ],
            {
              useNativeDriver: true,
            },
          )}
        />
        <AccountsHeader scrollY={scrollY} />
      </View>
    );
  }
}

export default connect(mapStateToProps)(Accounts);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
  },
  contentContainer: {
    marginTop: 150,
    paddingBottom: 150,
  },
  accountItem: {
    marginBottom: 10,
  },
  accountItemFirst: {
    marginTop: 10,
  },
});
