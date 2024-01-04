'use client';

import { expenses, income, initialState } from '@/constants';
import { calculateTotal, formatCurrency, getRandomColor, processTransactionData, verifyCategories } from '@/helpers';
import { useLoad, useMemory } from '@/hooks';
import type { DataTupla, Transaction, TransactionData, TransactionType, UpdateData } from '@/models';
import { ERROR_MESSAGES } from '@/models';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BalanceTransaction,
  CategoriesTransaction,
  Graphic,
  GraphicDataContainer,
  Skeleton,
  ToggleButtonTransaction,
  TotalBalanceAccount,
  TransactionList,
  TransactionSection
} from './components';

const addNewTransaction = (dataSet: DataTupla, transaction: Transaction) => {
  const [state, setState] = dataSet;
  const newTransaction = [...state, transaction];
  setState(newTransaction);
};

export default function Home() {
  const [data, setData] = useMemory<TransactionData>('data', initialState);
  const [expensesData, setExpensesData] = useMemory<Transaction[]>('expenses', []);
  const [incomeData, setIncomeData] = useMemory<Transaction[]>('income', []);
  const [balance, setBalance] = useMemory('balance', 0);
  const [transactionType, setTransactionType] = useState<TransactionType>(income);
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [error, setError] = useState<ERROR_MESSAGES | string>('');
  const myModalCategoryRef = useRef<HTMLDialogElement>(null);
  const myModalCreateCategoryRef = useRef<HTMLDialogElement>(null);
  const { transactionsCategories, isLocalStorageLoaded, setTransactionsCategories } = useLoad();
  const transactionList = transactionType === expenses ? expensesData : incomeData;

  const calculateAndSetPercentages = useCallback(() => {
    let dataSet = transactionList;
    const total = calculateTotal(dataSet);
    const { percentages, backgroundColors, labels } = processTransactionData(dataSet, total);
    updateDataAndBalance(total, { percentages, backgroundColors, labels });
  }, [expensesData, incomeData, transactionType]);

  const handleTransactionSave = (ref: React.RefObject<HTMLDialogElement>) => {
    if (Number(amount) < 1) return setError(ERROR_MESSAGES.AMOUNT_LESS_THAN_ONE);
    if (category.length <= 2) return setError(ERROR_MESSAGES.CATEGORY_TOO_SHORT);

    const newColorTransaction = getRandomColor();
    const transactionDataSet: DataTupla = transactionType === income
      ? [incomeData, setIncomeData]
      : [expensesData, setExpensesData];

    const [dataTransaction] = transactionDataSet;

    const verifyAllCategories = verifyCategories(transactionsCategories, category);
    if (!verifyAllCategories) {
      const newCategoriesArray = [...transactionsCategories, category]
      setTransactionsCategories(newCategoriesArray);
    }

    const existCategory = dataTransaction.some(
      existingCategory => existingCategory.category.toLowerCase().includes(category.toLowerCase())
    );
    if (!existCategory) {
      const newTransaction: Transaction = {
        fuente: category,
        amount: Number(amount),
        color: newColorTransaction,
        type: transactionType,
        category,
      };
      addNewTransaction(transactionDataSet, newTransaction);
    } else {
      const findIndexCategory = dataTransaction.findIndex(
        transaction => transaction.category.toLowerCase() === category.toLowerCase()
      );
      if (findIndexCategory !== -1) updateExistingTransaction(findIndexCategory, dataTransaction);
    }
    clearInputs();
    ref.current?.close();
  }

  const updateExistingTransaction = (index: number, dataTransaction: Transaction[]) => {
    const transaction = dataTransaction[index];
    if (transaction && amount) {
      const newAmount = transaction.amount += amount;
      const total = calculateTotal(dataTransaction);
      const { percentages, backgroundColors, labels } = processTransactionData(dataTransaction, total);
      updateDataAndBalance(newAmount, { percentages, backgroundColors, labels });
    };
  };

  const updateDataAndBalance = (newAmount: number, { labels, percentages, backgroundColors }: UpdateData) => {
    const formatAmount = formatCurrency(newAmount);
    const cleanedAmount = formatAmount.replace(/[^0-9.-]+/g, '');
    const numericAmount = parseFloat(cleanedAmount);

    setBalance(numericAmount);
    setData((prevData: TransactionData) => ({
      labels,
      datasets: [{
        ...prevData.datasets[0],
        data: percentages,
        backgroundColor: backgroundColors,
      }],
    }));
  };

  const updateTransactionState = (newState: Transaction[]) => {
    const transactionDataSet: DataTupla = transactionType === income
      ? [incomeData, setIncomeData]
      : [expensesData, setExpensesData];

    const [_, setState] = transactionDataSet
    setState(newState);
  }

  const calculateTotalBalance = () => {
    const incomeTotal = calculateTotal(incomeData);
    const expenseTotal = calculateTotal(expensesData);
    return formatCurrency(incomeTotal - expenseTotal);
  };

  const handleTransactionTypeToggle = (transaction: TransactionType) => {
    setTransactionType(transaction);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amountValue = Number(e.target.value);
    setAmount(amountValue);
  };

  const handleCategoryCreation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categoryValue = e.target.value;
    setCategory(categoryValue);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const clearInputs = () => {
    setAmount(null);
    setCategory('');
    setError('');
  };

  useEffect(() => {
    calculateAndSetPercentages();
  }, [calculateAndSetPercentages]);

  if (!isLocalStorageLoaded) return <Skeleton />

  return (
    <main className="flex flex-col gap-3 items-center min-h-screen py-3">
      <GraphicDataContainer>
        <ToggleButtonTransaction
          onHandleTransactionTypeToggle={handleTransactionTypeToggle}
          transactionType={transactionType}
        />
        <TotalBalanceAccount calculateTotalBalance={calculateTotalBalance} />
        <Graphic data={data} />
        <BalanceTransaction
          transactionType={transactionType}
          balance={balance}
        />
      </GraphicDataContainer>

      <TransactionSection
        transactionType={transactionType}
        amount={amount}
        category={category}
        error={error}
        transactionsCategories={transactionsCategories}
        myModalCreateCategoryRef={myModalCreateCategoryRef}
        myModalCategoryRef={myModalCategoryRef}
        onHandleAmountChange={handleAmountChange}
        onHandleCategoryChange={handleCategoryChange}
        onHandleCategoryCreation={handleCategoryCreation}
        onHandleTransactionSave={handleTransactionSave}
      />

      <CategoriesTransaction transactionList={transactionList} />

      <TransactionList
        transactionList={transactionList}
        transactionType={transactionType}
        updateTransactionState={updateTransactionState}
      />
    </main>
  )
}
