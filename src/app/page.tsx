'use client';

import { expenses, income, initialState } from '@/constants';
import { addNewTransaction, calculateTotal, formatCurrency, getRandomColor, processTransactionData, verifyCategories } from '@/helpers';
import { useLoad, useMemory } from '@/hooks';
import type { DataTupla, Transaction, TransactionData, TransactionType, UpdateData } from '@/models';
import { ERROR_MESSAGES, LocalStorageKeys } from '@/models';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
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

export default function Home() {
  const [data, setData] = useMemory<TransactionData>(LocalStorageKeys.DATA, initialState);
  const [expensesData, setExpensesData] = useMemory<Transaction[]>(LocalStorageKeys.EXPENSES, []);
  const [incomeData, setIncomeData] = useMemory<Transaction[]>(LocalStorageKeys.INCOMES, []);
  const [balance, setBalance] = useMemory(LocalStorageKeys.BALANCE, 0);
  const [transactionType, setTransactionType] = useMemory<TransactionType>(LocalStorageKeys.TRANSACTION_TYPE, income);
  const [transactionAmount, setTransactionAmount] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [transactionError, setTransactionError] = useState<ERROR_MESSAGES | string>('');
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

    const transactionDataSet: DataTupla = getTransactionDataSet();
    const [dataTransaction] = transactionDataSet;

    saveTransaction(dataTransaction, transactionDataSet);
    clearInputs();
    ref.current?.close();
    toast.success(`Se creo correctamente su ${transactionType === income ? 'ingreso' : 'gasto'}`);
  };

  const validateTransactionData = (data: Transaction[]) => {
    const verifyAllCategories = verifyCategories(transactionsCategories, category);
    if (!verifyAllCategories) {
      const newCategoriesArray = [...transactionsCategories, category]
      setTransactionsCategories(newCategoriesArray);
    };

    const existCategory = data.some(
      existingCategory => existingCategory.category.toLowerCase().includes(category.toLowerCase())
    );
    return existCategory;
  };

  const saveTransaction = (dataTransaction: Transaction[], transactionDataSet: DataTupla) => {
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
    };
  };

  const updateExistingTransaction = (index: number, currentData: Transaction[]) => {
    const transaction = currentData[index];
    if (transaction && transactionAmount) {
      const newAmount = transaction.amount += transactionAmount;
      const updatedData = currentData.map((t, i) =>
        i === index ? { ...t, amount: newAmount } : t
      );
      updateDataAndBalance(newAmount, processTransactionData(updatedData, calculateTotal(updatedData)));
    };
  };

  const updateDataAndBalance = (newAmount: number, { labels, percentages, backgroundColors }: UpdateData) => {
    setBalance(formatCurrency(newAmount));
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
    const transactionDataSet: DataTupla = getTransactionDataSet();
    const [_, setState] = transactionDataSet;
    setState(newState);
  };

  const getTransactionDataSet = (): DataTupla => {
    return transactionType === income
      ? [incomeData, setIncomeData]
      : [expensesData, setExpensesData];
  };

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
        onHandleAmountChange={handleAmountChange}
        onHandleCategoryChange={handleCategoryChange}
        onHandleCategoryCreation={handleCategoryCreation}
        onHandleTransactionSave={handleTransactionSave}
      />

      <CategoriesTransaction transactionList={transaction} />

      <TransactionList
        transactionList={transaction}
        transactionType={transactionType}
        updateTransactionState={updateTransactionState}
      />
    </main>
  )
}
