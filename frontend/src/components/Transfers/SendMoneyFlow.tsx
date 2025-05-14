
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, ArrowRight, Circle, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CurrencyInput from '../common/CurrencyInput';
import RecipientCard, { RecipientProps } from '../common/RecipientCard';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for recipients
const recipients: RecipientProps[] = [
  {
    id: 'rec1',
    name: 'Gulf Trading Solutions LLC',
    accountNumber: 'IBAN5678901234',
    bankName: 'Emirates NBD',
    type: 'business',
    stableportId: 'SP6790234',
  },
  {
    id: 'rec2',
    name: 'Burj Enterprise Partners',
    accountNumber: 'IBAN9012345678',
    bankName: 'Dubai Islamic Bank',
    type: 'business',
    stableportId: 'SP1234567',
  },
  {
    id: 'rec3',
    name: 'Dubai Logistics Co.',
    accountNumber: 'IBAN1234567890',
    bankName: 'Abu Dhabi Commercial Bank',
    type: 'business',
    stableportId: 'SP9876543',
  },
];

// Mock exchange rates for fiat currencies
const exchangeRates = {
  NGN: { AED: 0.01, USDC: 0.00065 },
  KES: { AED: 0.03, USDC: 0.0075 },
  GHS: { AED: 0.05, USDC: 0.085 },
  USDC: { AED: 3.67, NGN: 1538.46, KES: 133.33, GHS: 11.76 }
};

type SendStep = 'recipient' | 'amount' | 'conversion' | 'summary' | 'confirmation';

const SendMoneyFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState<SendStep>('recipient');
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('AED');
  const [sourceCurrency, setSourceCurrency] = useState('NGN');
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientProps | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState<string>('0.00');
  const [invoiceReference, setInvoiceReference] = useState<string>('');
  const [sourceAmount, setSourceAmount] = useState<string>('0.00');
  
  // Parse recipient ID from URL if available
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const recipientId = params.get('recipient');
    
    if (recipientId) {
      const recipient = recipients.find(r => r.id === recipientId);
      if (recipient) {
        setSelectedRecipient(recipient);
      }
    }
  }, [location.search]);

  const handleTargetAmountChange = (value: string, curr: string) => {
    setAmount(value);
    setTargetCurrency(curr);
    
    // Calculate equivalent source amount when target amount changes
    if (value) {
      // Calculate how much source currency is needed
      const rate = (exchangeRates[curr as keyof typeof exchangeRates] as any)?.[sourceCurrency] || 0;
      const calculatedSourceAmount = parseFloat(value) * rate;
      setSourceAmount(calculatedSourceAmount.toFixed(2));
      
      // Calculate crypto amount
      const cryptoValue = calculatedSourceAmount * ((exchangeRates[sourceCurrency as keyof typeof exchangeRates] as any)?.USDC || 0);
      setCryptoAmount(cryptoValue.toFixed(2));
    } else {
      setSourceAmount('0.00');
      setCryptoAmount('0.00');
    }
  };

  const handleInvoiceReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceReference(e.target.value);
  };

  const handleRecipientSelect = (recipient: RecipientProps) => {
    setSelectedRecipient(recipient);
  };

  const handleBackClick = () => {
    if (currentStep === 'recipient') {
      navigate('/');
    } else if (currentStep === 'amount') {
      setCurrentStep('recipient');
    } else if (currentStep === 'conversion') {
      setCurrentStep('amount');
    } else if (currentStep === 'summary') {
      setCurrentStep('conversion');
    } else {
      navigate('/');
    }
  };

  const handleNextClick = () => {
    if (currentStep === 'recipient') {
      if (!selectedRecipient) {
        toast.error('Please select a recipient');
        return;
      }
      setCurrentStep('amount');
    } else if (currentStep === 'amount') {
      if (!amount || parseFloat(amount) <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      if (!invoiceReference) {
        toast.error('Please enter an invoice reference');
        return;
      }
      setCurrentStep('conversion');
    } else if (currentStep === 'conversion') {
      setCurrentStep('summary');
    } else if (currentStep === 'summary') {
      // In a real app, this would call an API to process the payment
      toast.success('Payment initiated successfully');
      setTransactionId('tx' + Date.now());
      setCurrentStep('confirmation');
    }
  };

  const calculateFee = () => {
    if (!sourceAmount) return '0.00';
    // Mock fee calculation - 1% of the amount
    const fee = parseFloat(sourceAmount) * 0.01;
    return fee.toFixed(2);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'recipient':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Select Recipient</h1>
            
            <Tabs defaultValue="existing">
              <TabsList className="w-full">
                <TabsTrigger value="existing" className="flex-1">Business Recipients</TabsTrigger>
              </TabsList>
              <TabsContent value="existing" className="mt-4">
                <div className="space-y-3">
                  {recipients.map(recipient => (
                    <RecipientCard
                      key={recipient.id}
                      recipient={recipient}
                      onClick={handleRecipientSelect}
                      isSelected={selectedRecipient?.id === recipient.id}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
        
      case 'amount':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Invoice Details</h1>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <label className="text-sm font-medium text-muted-foreground">Recipient</label>
                  <div className="mt-2">
                    <RecipientCard recipient={selectedRecipient!} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium text-muted-foreground">Invoice Reference</label>
                  <input
                    type="text"
                    value={invoiceReference}
                    onChange={handleInvoiceReferenceChange}
                    placeholder="e.g. INV-2025-001"
                    className="w-full p-2 mt-1 border border-border rounded-md"
                  />
                </div>
                
                <CurrencyInput 
                  onValueChange={handleTargetAmountChange}
                  initialValue={amount}
                  initialCurrency={targetCurrency}
                  label="Invoice Amount"
                  availableCurrencies={[{ code: 'AED', name: 'UAE Dirham' }]}
                />
                
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-muted-foreground">You pay (estimated)</span>
                    <span>{sourceCurrency} {sourceAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Fee</span>
                    <span>{sourceCurrency} {calculateFee()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'conversion':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Currency Conversion</h1>
            
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Converting</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-light">{sourceCurrency} {sourceAmount}</span>
                    <div className="rounded-full bg-fintech-light-blue p-2">
                      <Circle size={28} className="text-fintech-blue" fill="#2775CA" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center py-2">
                  <ArrowLeftRight size={24} className="text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">To USDC (USD Coin)</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-light">USDC {cryptoAmount}</span>
                    <div className="bg-fintech-light-blue p-1 rounded-full">
                      <Circle size={28} className="text-fintech-blue" fill="#2775CA" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3">Conversion Details</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Exchange rate</span>
                      <span className="text-sm">1 {sourceCurrency} = {(exchangeRates[sourceCurrency as keyof typeof exchangeRates] as any)?.USDC} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Network fee</span>
                      <span className="text-sm">USDC 0.01</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estimated completion</span>
                      <span className="text-sm">~2 minutes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'summary':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Payment Summary</h1>
            
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Sender Side */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">You're paying</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-light">{sourceCurrency} {sourceAmount}</span>
                    <span className="text-sm text-muted-foreground">-{sourceCurrency} {calculateFee()} fee</span>
                  </div>
                </div>
                
                {/* Conversion Steps */}
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <div className="flex items-center justify-center gap-3 w-full">
                    <div className="h-px bg-border flex-1"></div>
                    <div className="flex items-center justify-center rounded-full bg-fintech-light-blue p-1">
                      <ArrowLeftRight size={20} className="text-fintech-blue" />
                    </div>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Converted to USDC {cryptoAmount}</p>
                  <div className="flex items-center justify-center gap-3 w-full">
                    <div className="h-px bg-border flex-1"></div>
                    <div className="flex items-center justify-center rounded-full bg-fintech-light-blue p-1">
                      <Circle size={20} className="text-fintech-blue" fill="#2775CA" />
                    </div>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Transfer via Stableport network</p>
                  <div className="flex items-center justify-center gap-3 w-full">
                    <div className="h-px bg-border flex-1"></div>
                    <div className="flex items-center justify-center rounded-full bg-fintech-light-blue p-1">
                      <ArrowLeftRight size={20} className="text-fintech-blue" />
                    </div>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                </div>
                
                {/* Recipient Side */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Recipient gets</h3>
                  <div className="text-2xl font-light">{targetCurrency} {amount}</div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3">Payment Details</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Recipient</span>
                      <span className="text-sm font-medium">{selectedRecipient?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stableport ID</span>
                      <span className="text-sm">{selectedRecipient?.stableportId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bank</span>
                      <span className="text-sm">{selectedRecipient?.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account</span>
                      <span className="text-sm">{selectedRecipient?.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Invoice Reference</span>
                      <span className="text-sm">{invoiceReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Fee</span>
                      <span className="text-sm">{sourceCurrency} {calculateFee()} + USDC 0.01 network fee</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Crypto Amount</span>
                      <span className="text-sm">USDC {cryptoAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Est. Arrival</span>
                      <span className="text-sm">Within 1-2 hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'confirmation':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-fintech-light-blue flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 rounded-full bg-fintech-blue flex items-center justify-center">
                  <Circle size={20} className="text-white" fill="#2775CA" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold mb-1">Payment Initiated</h1>
              <p className="text-muted-foreground">Payment to {selectedRecipient?.name} for {targetCurrency} {amount}</p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="transaction-step flex items-center">
                    <div className="bg-fintech-blue rounded-full p-1 z-10 mr-3">
                      <div className="bg-white rounded-full w-4 h-4"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Converting to USDC</h4>
                      <p className="text-xs text-muted-foreground">Processing payment</p>
                    </div>
                  </div>
                  
                  <div className="transaction-step flex items-center">
                    <div className="bg-muted rounded-full p-1 z-10 mr-3">
                      <div className="bg-white rounded-full w-4 h-4"></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground">USDC Transfer</h4>
                      <p className="text-xs text-muted-foreground">Sending {cryptoAmount} USDC via Stableport network</p>
                    </div>
                  </div>
                  
                  <div className="transaction-step flex items-center">
                    <div className="bg-muted rounded-full p-1 z-10 mr-3">
                      <div className="bg-white rounded-full w-4 h-4"></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground">Converting to {targetCurrency}</h4>
                      <p className="text-xs text-muted-foreground">Converting to recipient's currency</p>
                    </div>
                  </div>
                  
                  <div className="transaction-step flex items-center">
                    <div className="bg-muted rounded-full p-1 z-10 mr-3">
                      <div className="bg-white rounded-full w-4 h-4"></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground">USDC Received</h4>
                      <p className="text-xs text-muted-foreground">Recipient receives {targetCurrency} {amount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Transaction ID</span>
                    <span className="text-sm">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Invoice Reference</span>
                    <span className="text-sm">{invoiceReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount paid</span>
                    <span className="text-sm">{sourceCurrency} {sourceAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Crypto amount</span>
                    <span className="text-sm">USDC {cryptoAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Recipient gets</span>
                    <span className="text-sm">{targetCurrency} {amount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 py-6">
      {currentStep !== 'confirmation' && (
        <button 
          className="flex items-center text-muted-foreground mb-2" 
          onClick={handleBackClick}
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back</span>
        </button>
      )}
      
      {renderStepContent()}
      
      {currentStep !== 'confirmation' && (
        <Button 
          className="w-full" 
          size="lg" 
          onClick={handleNextClick}
        >
          {currentStep === 'summary' ? 'Confirm & Pay' : 'Continue'}
        </Button>
      )}
      
      {currentStep === 'confirmation' && (
        <div className="space-y-3">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={() => navigate(`/transaction/${transactionId}`)}
          >
            View Payment Details
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default SendMoneyFlow;
