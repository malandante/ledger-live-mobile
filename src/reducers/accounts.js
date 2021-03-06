// @flow
import { handleActions } from "redux-actions";
import { createSelector } from "reselect";
import uniq from "lodash/uniq";
import { createAccountModel } from "@ledgerhq/live-common/lib/models/account";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { OUTDATED_CONSIDERED_DELAY } from "../constants";

export const accountModel = createAccountModel();

export type AccountsState = {
  active: Account[],
};

const initialState: AccountsState = {
  active: [],
};

const handlers: Object = {
  ACCOUNTS_IMPORT: (s, { state }) => state,
  ACCOUNTS_ADD: (s, { account }) => ({
    active: s.active.concat(account),
  }),
  UPDATE_ACCOUNT: (
    state: AccountsState,
    { accountId, updater }: { accountId: string, updater: Account => Account },
  ): AccountsState => {
    function update(existingAccount) {
      if (accountId !== existingAccount.id) return existingAccount;
      return {
        ...existingAccount,
        ...updater(existingAccount),
      };
    }
    return {
      active: state.active.map(update),
    };
  },
  DELETE_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => ({
    active: state.active.filter(acc => acc.id !== account.id),
  }),
};

// Selectors

export const exportSelector = (s: *) => ({
  active: s.accounts.active.map(accountModel.encode),
});

export const accountsSelector = (s: *): Account[] => s.accounts.active;

export const currenciesSelector = createSelector(accountsSelector, acc =>
  uniq(acc.map(a => a.currency)),
);

export const accountScreenSelector = createSelector(
  accountsSelector,
  (_, { navigation }) => navigation.state.params.accountId,
  (accounts, accountId) => accounts.find(a => a.id === accountId),
);

export const isUpToDateSelector = createSelector(accountsSelector, accounts =>
  accounts.every(a => {
    const { lastSyncDate } = a;
    const { blockAvgTime } = a.currency;
    if (!blockAvgTime) return true;
    const outdated =
      Date.now() - (lastSyncDate || 0) >
      blockAvgTime * 1000 + OUTDATED_CONSIDERED_DELAY;
    return !outdated;
  }),
);

export default handleActions(handlers, initialState);
