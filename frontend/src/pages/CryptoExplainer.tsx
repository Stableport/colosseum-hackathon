
import React from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, Coins, ArrowLeftRight, Wallet } from 'lucide-react';

const CryptoExplainer = () => {
  return (
    <AppLayout>
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-semibold">How Our Cross-Border Transfers Work</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>The Power of Crypto for International Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Our platform uses blockchain technology and stablecoins like USDC (USD Coin) to make 
              international transfers faster, cheaper, and more accessible than traditional banking.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <ArrowLeftRight size={18} className="text-primary" />
                  Lower Fees
                </h3>
                <p className="text-sm text-muted-foreground">
                  By using cryptocurrency as an intermediary, we avoid the high fees charged by traditional 
                  banks and money transfer services for international transfers.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Coins size={18} className="text-primary" /> 
                  Better Exchange Rates
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our crypto-powered system allows us to offer more competitive exchange rates than traditional 
                  financial institutions that add significant margins.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Wallet size={18} className="text-primary" /> 
                  Faster Transfers
                </h3>
                <p className="text-sm text-muted-foreground">
                  Blockchain transactions settle in minutes rather than days, allowing recipients to 
                  access their funds much faster than with traditional wire transfers.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Circle size={18} className="text-primary" fill="#2775CA" /> 
                  Transparency
                </h3>
                <p className="text-sm text-muted-foreground">
                  Blockchain technology provides full transparency of the transfer process, allowing 
                  you to track your money every step of the way.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ol className="space-y-8">
              <li className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-fintech-light-blue p-2 flex items-center justify-center">
                    <span className="text-fintech-blue font-semibold">1</span>
                  </div>
                  <div className="h-full w-px bg-border mt-2"></div>
                </div>
                <div>
                  <h3 className="font-medium">You send local currency</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You initiate a transfer using your local currency (NGN, KES, or GHS). 
                    Our system accepts your payment through local payment methods.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-fintech-light-blue p-2 flex items-center justify-center">
                    <span className="text-fintech-blue font-semibold">2</span>
                  </div>
                  <div className="h-full w-px bg-border mt-2"></div>
                </div>
                <div>
                  <h3 className="font-medium">Conversion to Stablecoin</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We convert your local currency to USDC (USD Coin), a stablecoin that's pegged to the US dollar. 
                    This happens in seconds with minimal slippage.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-fintech-light-blue p-2 flex items-center justify-center">
                    <span className="text-fintech-blue font-semibold">3</span>
                  </div>
                  <div className="h-full w-px bg-border mt-2"></div>
                </div>
                <div>
                  <h3 className="font-medium">Blockchain Transfer</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The USDC is transferred across borders via blockchain technology. This transfer is fast, 
                    secure, and has significantly lower fees than traditional banking rails.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-fintech-light-blue p-2 flex items-center justify-center">
                    <span className="text-fintech-blue font-semibold">4</span>
                  </div>
                  <div className="h-full w-px bg-border mt-2"></div>
                </div>
                <div>
                  <h3 className="font-medium">Conversion to Recipient's Currency</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Once received in the destination country, the stablecoin is converted to the recipient's 
                    local currency (e.g., AED) at competitive rates.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-fintech-light-blue p-2 flex items-center justify-center">
                    <span className="text-fintech-blue font-semibold">5</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Recipient Receives Funds</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The recipient receives their local currency in their bank account, mobile wallet, 
                    or as cash pickup, typically within hours instead of days.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Do I need to know anything about cryptocurrency?</h3>
              <p className="text-sm text-muted-foreground">
                No. Our platform handles all the crypto conversions behind the scenes. 
                You send and receive in your local currency without needing any crypto knowledge.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Is this secure?</h3>
              <p className="text-sm text-muted-foreground">
                Yes. We use regulated stablecoins and secure blockchain networks. Your funds are protected 
                throughout the entire process with industry-standard security protocols.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">How long do transfers take?</h3>
              <p className="text-sm text-muted-foreground">
                Most transfers are completed within 1-2 hours, significantly faster than traditional banking 
                systems which can take 3-5 business days for international transfers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CryptoExplainer;
