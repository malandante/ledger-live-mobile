// @flow

import React, { Component } from "react";
import { View, StyleSheet, StatusBar, SectionList } from "react-native";
import { connect } from "react-redux";

import type { Account, Operation } from "@ledgerhq/live-common/lib/types";
import { groupAccountsOperationsByDay } from "@ledgerhq/live-common/lib/helpers/account";

import { accountsSelector } from "../../reducers/accounts";

import colors from "../../colors";

import SectionHeader from "../../components/SectionHeader";
import NoMoreOperationFooter from "../../components/NoMoreOperationFooter";
import NoOperationFooter from "../../components/NoOperationFooter";
import LoadingFooter from "../../components/LoadingFooter";
import LText from "../../components/LText";
import PortfolioGraphCard from "./PortfolioGraphCard";
// import PortfolioHeader from "./PortfolioHeader";
import OperationRow from "../../components/OperationRow";
import PortfolioIcon from "../../images/icons/Portfolio";
import SyncIndicator from "../../components/SyncIndicator";
import provideSyncRefreshControl from "../../components/provideSyncRefreshControl";

const List = provideSyncRefreshControl(SectionList);

const navigationOptions = {
  tabBarIcon: ({ tintColor }: *) => (
    <PortfolioIcon size={18} color={tintColor} />
  ),
};

const mapStateToProps = state => ({ accounts: accountsSelector(state) });

class Portfolio extends Component<
  {
    accounts: Account[],
    navigation: *,
  },
  {
    opCount: number,
  },
> {
  static navigationOptions = navigationOptions;

  state = {
    opCount: 50,
  };

  keyExtractor = (item: Operation) => item.id;

  renderItem = ({ item }: { item: Operation }) => {
    const account = this.props.accounts.find(a => a.id === item.accountId);

    if (!account) return null;

    return (
      <OperationRow
        operation={item}
        account={account}
        navigation={this.props.navigation}
      />
    );
  };

  onEndReached = () => {
    this.setState(({ opCount }) => ({ opCount: opCount + 50 }));
  };

  render() {
    const { accounts } = this.props;
    const { opCount } = this.state;

    if (accounts.length === 0) {
      return (
        <View style={styles.root}>
          <LText>No account</LText>
        </View>
      );
    }

    const { sections, completed } = groupAccountsOperationsByDay(
      accounts,
      opCount,
    );

    // TODO pull to refresh connected to bridge (need to think it modular so we can reuse easily)

    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" />

        <List
          sections={(sections: any)}
          style={styles.sectionList}
          ListHeaderComponent={GraphCardContainer}
          ListFooterComponent={
            !completed
              ? LoadingFooter
              : sections.length === 0
                ? NoOperationFooter
                : NoMoreOperationFooter
          }
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          renderSectionHeader={SectionHeader}
          onEndReached={this.onEndReached}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

const GraphCardContainer = () => (
  <View style={styles.graphCardContainer}>
    <SyncIndicator />
    <PortfolioGraphCard />
  </View>
);

export default connect(mapStateToProps)(Portfolio);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  sectionList: {
    flex: 1,
  },
  graphCardContainer: {
    padding: 20,
  },
});
