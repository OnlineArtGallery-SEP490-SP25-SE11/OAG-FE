'use client';

import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { walletService } from '../queries';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { WithdrawForm, withdrawSchema } from '@/types/withdraw';
import { zodResolver } from '@hookform/resolvers/zod';
import bankRequestService from '@/service/bank-request';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../deposit/constants";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { AlertCircle, ArrowRight, Wallet, CreditCard, CheckCircle2, Loader2, Building } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function WithdrawalPage() {
    const { toast } = useToast();
    const [selectedPresetAmount, setSelectedPresetAmount] = useState<number | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [withdrawalStep, setWithdrawalStep] = useState(1);
    
    const form = useForm<WithdrawForm>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            bankName: '',
            bankAccountName: '',
            idBankAccount: '',
            amount: 0
        }
    });
    
    const { data, error, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['wallet'],
        queryFn: () => walletService.getWallet(),
        placeholderData: (previousData: unknown) => previousData,
        refetchOnWindowFocus: true
    });
    
    const currentBalance = data?.data?.balance || 0;
    const limitWithdraw = 100000000;
    const totalWithdrawals = data?.data?.totalWithdrawInDay || 0;
    const remainingWithdrawalLimit = limitWithdraw - totalWithdrawals;
    const presetAmounts = [500000, 1000000, 2000000, 5000000, 10000000];

    const mutation = useMutation({
        mutationFn: (data: WithdrawForm) => bankRequestService.createWithdrawRequest(data),
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Withdrawal request has been created successfully',
            });
            form.reset();
            setSelectedPresetAmount(null);
            setWithdrawalStep(1);
            setShowConfirmation(false);
            refetch();
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: 'Unable to create withdrawal request',
                variant: 'destructive',
            });
            setWithdrawalStep(1);
            setShowConfirmation(false);
        }
    });
    
    const validateForm = () => {
        if (totalWithdrawals >= limitWithdraw) {
            toast({
                title: 'Daily Limit Reached',
                description: 'You have reached your daily withdrawal limit',
                variant: 'destructive',
            });
            return false;
        }
        
        const amount = form.getValues('amount');
        
        if (Number(amount) > currentBalance) {
            toast({
                title: 'Insufficient Balance',
                description: 'Withdrawal amount cannot exceed current balance',
                variant: 'destructive',
            });
            return false;
        }
        
        if (Number(amount) <= 0) {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter an amount greater than 0',
                variant: 'destructive',
            });
            return false;
        }
        
        return true;
    };

    const handleProceedToConfirmation = async () => {
        const valid = await form.trigger();
        if (valid && validateForm()) {
            setShowConfirmation(true);
            setWithdrawalStep(2);
        }
    };
    
    const handleConfirm = () => {
        const values = form.getValues();
        mutation.mutate(values);
        setWithdrawalStep(3);
    };
    
    const handleCancel = () => {
        setShowConfirmation(false);
        setWithdrawalStep(1);
    };

    const handlePresetAmountClick = (amount: number) => {
        setSelectedPresetAmount(amount);
        form.setValue('amount', amount);
    };
    
    if (isLoading) {
        return (
            <div className="container mx-auto py-20 flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg text-muted-foreground">Loading your wallet information...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-10 max-w-2xl">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${withdrawalStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            1
                        </div>
                        <span className="text-sm mt-2">Details</span>
                    </div>
                    <div className="h-1 flex-1 mx-2 bg-muted">
                        <div className={`h-full bg-primary transition-all duration-300 ${withdrawalStep >= 2 ? 'w-full' : 'w-0'}`}></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${withdrawalStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            2
                        </div>
                        <span className="text-sm mt-2">Confirm</span>
                    </div>
                    <div className="h-1 flex-1 mx-2 bg-muted">
                        <div className={`h-full bg-primary transition-all duration-300 ${withdrawalStep >= 3 ? 'w-full' : 'w-0'}`}></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${withdrawalStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            3
                        </div>
                        <span className="text-sm mt-2">Complete</span>
                    </div>
                </div>
            </div>
            
            {/* Wallet Balance Card */}
            <Card className="mb-6 shadow-md transition-shadow border-primary/10">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <CardTitle className="text-2xl">Wallet Balance</CardTitle>
                    </div>
                    <CardDescription>Current amount in your account</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <p className="text-3xl font-bold text-primary">
                        {formatCurrency(currentBalance)}
                    </p>
                    {remainingWithdrawalLimit < limitWithdraw && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Daily withdrawal limit remaining: {formatCurrency(remainingWithdrawalLimit)}
                        </p>
                    )}
                </CardContent>
            </Card>
            
            {/* Withdrawal Form Card */}
            <Card className="shadow-md transition-shadow border-primary/10">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        <CardTitle className="text-2xl">Withdraw Money</CardTitle>
                    </div>
                    <CardDescription>Enter your details to withdraw money to your bank account</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {currentBalance <= 0 && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Insufficient Balance</AlertTitle>
                            <AlertDescription>
                                Your wallet balance is not enough to make a withdrawal
                            </AlertDescription>
                        </Alert>
                    )}
                    {totalWithdrawals >= limitWithdraw && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Withdrawal Limit Exceeded</AlertTitle>
                            <AlertDescription>
                                You have reached your daily withdrawal limit
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    {!showConfirmation ? (
                        <Form {...form}>
                            <form className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="bankName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">Bank Name</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Enter bank name" 
                                                        {...field} 
                                                        className="focus:ring-1 focus:ring-primary"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter the name of your bank
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="bankAccountName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-medium">Account Holder Name</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Enter account holder name" 
                                                        {...field} 
                                                        className="focus:ring-1 focus:ring-primary"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    As it appears on your bank account
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                <FormField
                                    control={form.control}
                                    name="idBankAccount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">Account Number</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Enter account number" 
                                                    {...field} 
                                                    className="focus:ring-1 focus:ring-primary"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Your bank account number (no spaces)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">Withdrawal Amount</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="Enter amount to withdraw" 
                                                    {...field} 
                                                    onChange={(e) => {
                                                        field.onChange(Number(e.target.value));
                                                        setSelectedPresetAmount(null);
                                                    }}
                                                    className="focus:ring-1 focus:ring-primary"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <div className="flex justify-between text-sm text-muted-foreground mt-1.5">
                                                <span>Available balance: {formatCurrency(currentBalance)}</span>
                                                {remainingWithdrawalLimit < limitWithdraw && (
                                                    <span>Daily limit remaining: {formatCurrency(remainingWithdrawalLimit)}</span>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    <p className="text-sm font-medium mb-2">Quick amount selection:</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {presetAmounts.map((amount) => (
                                            <Button 
                                                key={amount}
                                                type="button"
                                                variant={selectedPresetAmount === amount ? "default" : "outline"}
                                                onClick={() => handlePresetAmountClick(amount)}
                                                disabled={amount > currentBalance || totalWithdrawals >= limitWithdraw}
                                                className="transition-all"
                                            >
                                                {formatCurrency(amount)}
                                            </Button>
                                        ))}
                                        {currentBalance > 0 && (
                                            <Button 
                                                type="button"
                                                variant={selectedPresetAmount === currentBalance ? "default" : "outline"}
                                                onClick={() => handlePresetAmountClick(currentBalance)}
                                                disabled={totalWithdrawals >= limitWithdraw}
                                                className="transition-all"
                                            >
                                                Max ({formatCurrency(currentBalance)})
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                
                                <Separator className="my-4" />
                            </form>
                        </Form>
                    ) : (
                        <div className="space-y-6">
                            <Alert variant="default" className="bg-primary/5 border-primary/20">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <AlertTitle>Confirm Your Withdrawal</AlertTitle>
                                <AlertDescription>
                                    Please verify the information below before confirming
                                </AlertDescription>
                            </Alert>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p className="font-medium text-muted-foreground">Bank Name:</p>
                                    <p>{form.getValues('bankName')}</p>
                                    
                                    <p className="font-medium text-muted-foreground">Account Holder:</p>
                                    <p>{form.getValues('bankAccountName')}</p>
                                    
                                    <p className="font-medium text-muted-foreground">Account Number:</p>
                                    <p>{form.getValues('idBankAccount')}</p>
                                    
                                    <p className="font-medium text-muted-foreground">Amount to Withdraw:</p>
                                    <p className="font-semibold text-primary">{formatCurrency(form.getValues('amount'))}</p>
                                    
                                    <p className="font-medium text-muted-foreground">Current Balance:</p>
                                    <p>{formatCurrency(currentBalance)}</p>
                                    
                                    <p className="font-medium text-muted-foreground">New Balance After Withdrawal:</p>
                                    <p>{formatCurrency(currentBalance - form.getValues('amount'))}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6 px-6">
                    {!showConfirmation ? (
                        <Button 
                            type="button" 
                            className="w-full py-6 text-lg font-medium"
                            disabled={isLoading || currentBalance <= 0 || totalWithdrawals >= limitWithdraw}
                            onClick={handleProceedToConfirmation}
                        >
                            Continue to Review <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    ) : (
                        <>
                            <Button 
                                variant="outline" 
                                className="w-full sm:w-1/2 py-6 text-lg font-medium"
                                onClick={handleCancel}
                                disabled={mutation.isPending}
                            >
                                Go Back
                            </Button>
                            <Button 
                                type="button" 
                                className="w-full sm:w-1/2 py-6 text-lg font-medium"
                                disabled={mutation.isPending}
                                onClick={handleConfirm}
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : "Confirm Withdrawal"}
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}