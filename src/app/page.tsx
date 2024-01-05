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

interface ValidateTransaction {
  existCategory: boolean;
  transactionDataSet: DataTupla;
  dataTransaction: Transaction[]
}

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
  const [transactionAmount, setTransactionAmount] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [transactionError, setTransactionError] = useState<ERROR_MESSAGES | string>('');
  const myModalCategoryRef = useRef<HTMLDialogElement>(null);
  const myModalCreateCategoryRef = useRef<HTMLDialogElement>(null);
  const { transactionsCategories, isLocalStorageLoaded, setTransactionsCategories } = useLoad();

  const transaction: Transaction[] = transactionType === expenses ? expensesData : incomeData;

  const calculateAndSetPercentages = useCallback(() => {
    let dataSet = transaction;
    const total = calculateTotal(dataSet);
    const { percentages, backgroundColors, labels } = processTransactionData(dataSet, total);
    updateDataAndBalance(total, { percentages, backgroundColors, labels });
  }, [expensesData, incomeData, transactionType]);

  const handleTransactionSave = (ref: React.RefObject<HTMLDialogElement>) => {
    if (Number(transactionAmount) < 1) return setTransactionError(ERROR_MESSAGES.AMOUNT_LESS_THAN_ONE);
    if (category.length <= 2) return setTransactionError(ERROR_MESSAGES.CATEGORY_TOO_SHORT);

    const transactionDataSet: DataTupla = transactionType === income
      ? [incomeData, setIncomeData]
      : [expensesData, setExpensesData];

    const [dataTransaction] = transactionDataSet;

    if (!validateTransactionData(dataTransaction)) {
      const newColorTransaction = getRandomColor();
      const newTransaction: Transaction = {
        fuente: category,
        amount: Number(transactionAmount),
        color: newColorTransaction,
        type: transactionType,
        category,
      };
      addNewTransaction(transactionDataSet, newTransaction);
    } else {
      const findIndexCategory: number = dataTransaction.findIndex(
        (transaction: Transaction) => transaction.category.toLowerCase() === category.toLowerCase()
      );
      if (findIndexCategory !== -1) updateExistingTransaction(findIndexCategory, dataTransaction);
    }
    clearInputs();
    ref.current?.close();
  }

  const validateTransactionData = (data: Transaction[]) => {
    const verifyAllCategories: boolean = verifyCategories(transactionsCategories, category);
    if (!verifyAllCategories) {
      const newCategoriesArray = [...transactionsCategories, category]
      setTransactionsCategories(newCategoriesArray);
    };

    const existCategory: boolean = data.some(
      existingCategory => existingCategory.category.toLowerCase().includes(category.toLowerCase())
    );

    return existCategory;
  }

  const updateExistingTransaction = (index: number, dataTransaction: Transaction[]) => {
    const transaction = dataTransaction[index];
    if (transaction && transactionAmount) {
      const newAmount = transaction.amount += transactionAmount;
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
    setTransactionAmount(amountValue);
  };

  const handleCategoryCreation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categoryValue = e.target.value;
    setCategory(categoryValue);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const clearInputs = () => {
    setTransactionAmount(null);
    setCategory('');
    setTransactionError('');
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
        amount={transactionAmount}
        category={category}
        error={transactionError}
        transactionsCategories={transactionsCategories}
        myModalCreateCategoryRef={myModalCreateCategoryRef}
        myModalCategoryRef={myModalCategoryRef}
        onHandleAmountChange={handleAmountChange}
        onHandleCategoryChange={handleCategoryChange}
        onHandleCategoryCreation={handleCategoryCreation}
        onHandleTransactionSave={handleTransactionSave}
      />

      <CategoriesTransaction transactionList={transaction} />

      <TransactionList
        transactionList={transaction}
        transactionType={transactionType}
        transactionsCategories={transactionsCategories}
        updateTransactionState={updateTransactionState}
      />
    </main>
  )
}
