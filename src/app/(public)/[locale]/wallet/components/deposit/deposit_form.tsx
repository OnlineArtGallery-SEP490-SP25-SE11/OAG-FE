'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { useState } from 'react';

interface DepositMethod {
    id: string;
    name: string;
    logo: string;
    description: string;
}

interface DepositFormProps {
    depositMethods: DepositMethod[];
    presetAmounts: number[];
    onSubmit: (amount: string, method: string) => void;
}

export function DepositForm({ depositMethods, presetAmounts, onSubmit }: DepositFormProps) {
    const [method, setMethod] = useState('bank');
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalAmount = amount === 'custom' ? customAmount : amount;
        if (Number(finalAmount) > 0 && method) {
            onSubmit(finalAmount, method);
        }
    };

    return (
        <Card className="border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-green-500"
                    >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    Deposit Funds
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Label>Select Amount</Label>
                        <Tabs defaultValue="preset" className="w-full">
                            <TabsList className="grid grid-cols-2">
                                <TabsTrigger value="preset">Preset Amounts</TabsTrigger>
                                <TabsTrigger value="custom">Custom Amount</TabsTrigger>
                            </TabsList>
                            <TabsContent value="preset" className="pt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {presetAmounts.map((presetAmount) => (
                                        <Button
                                            key={presetAmount}
                                            type="button"
                                            variant={amount === String(presetAmount) ? "default" : "outline"}
                                            className="h-16 text-lg"
                                            onClick={() => setAmount(String(presetAmount))}
                                        >
                                            {presetAmount.toLocaleString()} VND
                                        </Button>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="custom" className="space-y-3 pt-4">
                                <Label>Enter Amount (VND)</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter deposit amount"
                                    className="h-12"
                                    value={customAmount}
                                    onChange={(e) => {
                                        setCustomAmount(e.target.value);
                                        setAmount('custom');
                                    }}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-4">
                        <Label>Select Payment Method</Label>
                        <RadioGroup
                            defaultValue={method}
                            onValueChange={setMethod}
                            className="grid gap-4"
                        >
                            {depositMethods.map((depositMethod) => (
                                <div
                                    key={depositMethod.id}
                                    className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer ${method === depositMethod.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                                        }`}
                                    onClick={() => setMethod(depositMethod.id)}
                                >
                                    <RadioGroupItem value={depositMethod.id} id={depositMethod.id} />
                                    <div className="flex flex-1 items-center justify-between">
                                        <Label
                                            htmlFor={depositMethod.id}
                                            className="flex items-center gap-3 cursor-pointer"
                                        >
                                            {depositMethod.logo && (
                                                <div className="h-10 w-10 rounded-md border bg-white p-1 flex items-center justify-center">
                                                    <Image
                                                        src={depositMethod.logo}
                                                        alt={depositMethod.name}
                                                        width={30}
                                                        height={30}
                                                        className="h-auto w-auto object-contain"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{depositMethod.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {depositMethod.description}
                                                </div>
                                            </div>
                                        </Label>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition-opacity"
                        disabled={!((amount && amount !== 'custom') || (amount === 'custom' && Number(customAmount) > 0))}
                    >
                        Continue to Deposit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
