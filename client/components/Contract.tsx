"use client";

import { useState, useCallback } from "react";
import {
  createCampaign,
  donateToCampaign,
  withdrawFunds,
  getCampaign,
  CONTRACT_ADDRESS,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2h2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2" />
      <rect width="16" height="14" x="4" y="4" rx="2" />
      <path d="M4 10h10" />
      <path d="M4 14h6" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

// ── Styled Input ──────────────���──────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#f43f5e]/30 focus-within:shadow-[0_0_20px_rgba(244,63,94,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Method Signature ─────────────────────────────────────────

function MethodSignature({
  name,
  params,
  returns,
  color,
}: {
  name: string;
  params: string;
  returns?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-mono text-sm">
      <span style={{ color }} className="font-semibold">fn</span>
      <span className="text-white/70">{name}</span>
      <span className="text-white/20 text-xs">{params}</span>
      {returns && (
        <span className="ml-auto text-white/15 text-[10px]">{returns}</span>
      )}
    </div>
  );
}

// ── Progress Bar ─────────────────────────────────────────

function ProgressBar({ raised, goal }: { raised: bigint; goal: bigint }) {
  const percentage = goal > 0 ? Number((raised * BigInt(100)) / goal) : 0;
  const clamped = Math.min(percentage, 100);
  const isComplete = raised >= goal;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/50">{Number(raised).toLocaleString()} XLM raised</span>
        <span className="text-white/50">{clamped.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isComplete ? "bg-gradient-to-r from-[#22c55e] to-[#34d399]" : "bg-gradient-to-r from-[#f43f5e] to-[#fb7185]"
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/30">0 XLM</span>
        <span className={cn("font-medium", isComplete ? "text-[#22c55e]" : "text-white/40")}>
          Goal: {Number(goal).toLocaleString()} XLM
        </span>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

type Tab = "view" | "create" | "donate";

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("view");
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // Create campaign state
  const [createId, setCreateId] = useState("");
  const [createGoal, setCreateGoal] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Donate state
  const [donateId, setDonateId] = useState("");
  const [donateAmount, setDonateAmount] = useState("");
  const [isDonating, setIsDonating] = useState(false);

  // View state
  const [viewId, setViewId] = useState("");
  const [isViewing, setIsViewing] = useState(false);
  const [campaignData, setCampaignData] = useState<{
    id: number;
    owner: string;
    goal: bigint;
    raised: bigint;
    active: boolean;
  } | null>(null);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleCreateCampaign = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!createId.trim() || !createGoal.trim()) return setError("Fill in all fields");
    const idNum = parseInt(createId.trim(), 10);
    const goalNum = parseInt(createGoal.trim(), 10) * 10000000; // Convert XLM to stroops
    if (isNaN(idNum) || isNaN(goalNum) || goalNum <= 0) return setError("Invalid campaign ID or goal");
    setError(null);
    setIsCreating(true);
    setTxStatus("Awaiting signature...");
    try {
      await createCampaign(walletAddress, idNum, BigInt(goalNum));
      setTxStatus("Campaign created on-chain!");
      setCreateId("");
      setCreateGoal("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsCreating(false);
    }
  }, [walletAddress, createId, createGoal]);

  const handleDonate = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!donateId.trim() || !donateAmount.trim()) return setError("Fill in all fields");
    const idNum = parseInt(donateId.trim(), 10);
    const amountNum = parseInt(donateAmount.trim(), 10) * 10000000; // Convert XLM to stroops
    if (isNaN(idNum) || isNaN(amountNum) || amountNum <= 0) return setError("Invalid campaign ID or amount");
    setError(null);
    setIsDonating(true);
    setTxStatus("Awaiting signature...");
    try {
      await donateToCampaign(walletAddress, idNum, BigInt(amountNum));
      setTxStatus("Donation received! Thank you!");
      setDonateAmount("");
      // Refresh campaign data
      if (viewId === donateId) {
        const result = await getCampaign(idNum, walletAddress);
        if (result && typeof result === "object") {
          setCampaignData(result as typeof campaignData);
        }
      }
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsDonating(false);
    }
  }, [walletAddress, donateId, donateAmount, viewId]);

  const handleWithdraw = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!viewId.trim()) return setError("Select a campaign first");
    const idNum = parseInt(viewId.trim(), 10);
    if (isNaN(idNum)) return setError("Invalid campaign ID");
    setError(null);
    setIsDonating(true);
    setTxStatus("Awaiting signature...");
    try {
      await withdrawFunds(walletAddress, idNum);
      setTxStatus("Funds withdrawn successfully!");
      setTimeout(() => setTxStatus(null), 5000);
      // Refresh
      const result = await getCampaign(idNum, walletAddress);
      if (result && typeof result === "object") {
        setCampaignData(result as typeof campaignData);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsDonating(false);
    }
  }, [walletAddress, viewId]);

  const handleViewCampaign = useCallback(async () => {
    if (!viewId.trim()) return setError("Enter a campaign ID");
    const idNum = parseInt(viewId.trim(), 10);
    if (isNaN(idNum)) return setError("Invalid campaign ID");
    setError(null);
    setIsViewing(true);
    setCampaignData(null);
    try {
      const result = await getCampaign(idNum, walletAddress || undefined);
      if (result && typeof result === "object") {
        setCampaignData(result as typeof campaignData);
      } else {
        setError("Campaign not found");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setIsViewing(false);
    }
  }, [viewId, walletAddress]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "view", label: "View", icon: <SearchIcon />, color: "#4fc3f7" },
    { key: "create", label: "Start", icon: <PlusIcon />, color: "#22c55e" },
    { key: "donate", label: "Donate", icon: <HeartIcon />, color: "#f43f5e" },
  ];

  const isCampaignOwner = walletAddress && campaignData && campaignData.owner === walletAddress;
  const canWithdraw = campaignData && campaignData.active && campaignData.raised >= campaignData.goal && isCampaignOwner;

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#22c55e]/15 bg-[#22c55e]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.05)] animate-slide-down">
          <span className="text-[#22c55e]">
            {txStatus.includes("on-chain") || txStatus.includes("success") || txStatus.includes("Thank") || txStatus.includes("received") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#22c55e]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#f43f5e]/20 to-[#fb7185]/20 border border-white/[0.06]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f43f5e]">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Fundraising</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all"
                    style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* View Campaign */}
            {activeTab === "view" && (
              <div className="space-y-5">
                <MethodSignature name="get_campaign" params="(id: u32)" returns="-> Campaign" color="#4fc3f7" />
                <Input label="Campaign ID" value={viewId} onChange={(e) => setViewId(e.target.value)} placeholder="e.g. 1" />
                <ShimmerButton onClick={handleViewCampaign} disabled={isViewing} shimmerColor="#4fc3f7" className="w-full">
                  {isViewing ? <><SpinnerIcon /> Loading...</> : <><SearchIcon /> View Campaign</>}
                </ShimmerButton>

                {campaignData && (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-fade-in-up">
                    <div className="border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-white/25">Campaign #{campaignData.id}</span>
                      <Badge variant={campaignData.active ? "success" : "warning"}>
                        {campaignData.active ? "Active" : "Closed"}
                      </Badge>
                    </div>
                    <div className="p-4 space-y-4">
                      <ProgressBar raised={campaignData.raised} goal={campaignData.goal} />
                      
                      <div className="pt-2 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-white/[0.02] p-3">
                          <span className="text-[10px] text-white/30 uppercase">Owner</span>
                          <p className="font-mono text-xs text-white/60 mt-1">{truncate(campaignData.owner)}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.02] p-3">
                          <span className="text-[10px] text-white/30 uppercase">Status</span>
                          <p className={cn("text-xs font-medium mt-1", campaignData.active ? "text-[#22c55e]" : "text-white/40")}>
                            {campaignData.raised >= campaignData.goal ? "Goal Reached!" : campaignData.active ? "Collecting" : "Closed"}
                          </p>
                        </div>
                      </div>

                      {canWithdraw && (
                        <ShimmerButton onClick={handleWithdraw} shimmerColor="#22c55e" className="w-full mt-2">
                          <ArrowUpIcon /> Withdraw Funds
                        </ShimmerButton>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Create Campaign */}
            {activeTab === "create" && (
              <div className="space-y-5">
                <MethodSignature name="create_campaign" params="(id: u32, owner: Address, goal: i128)" color="#22c55e" />
                <Input label="Campaign ID" value={createId} onChange={(e) => setCreateId(e.target.value)} placeholder="e.g. 1" />
                <Input label="Goal (XLM)" value={createGoal} onChange={(e) => setCreateGoal(e.target.value)} placeholder="e.g. 1000" />
                
                {walletAddress ? (
                  <ShimmerButton onClick={handleCreateCampaign} disabled={isCreating} shimmerColor="#22c55e" className="w-full">
                    {isCreating ? <><SpinnerIcon /> Creating...</> : <><PlusIcon /> Start Campaign</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#22c55e]/20 bg-[#22c55e]/[0.03] py-4 text-sm text-[#22c55e]/60 hover:border-[#22c55e]/30 hover:text-[#22c55e]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to create
                  </button>
                )}
              </div>
            )}

            {/* Donate */}
            {activeTab === "donate" && (
              <div className="space-y-5">
                <MethodSignature name="donate" params="(id: u32, donor: Address, amount: i128)" color="#f43f5e" />
                <Input label="Campaign ID" value={donateId} onChange={(e) => setDonateId(e.target.value)} placeholder="e.g. 1" />
                <Input label="Amount (XLM)" value={donateAmount} onChange={(e) => setDonateAmount(e.target.value)} placeholder="e.g. 50" />
                
                {walletAddress ? (
                  <ShimmerButton onClick={handleDonate} disabled={isDonating} shimmerColor="#f43f5e" className="w-full">
                    {isDonating ? <><SpinnerIcon /> Processing...</> : <><HeartIcon /> Donate Now</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#f43f5e]/20 bg-[#f43f5e]/[0.03] py-4 text-sm text-[#f43f5e]/60 hover:border-[#f43f5e]/30 hover:text-[#f43f5e]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to donate
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Fundraising on Soroban</p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#22c55e]" />
                <span className="font-mono text-[9px] text-white/15">Active</span>
              </span>
              <span className="text-white/10 text-[8px]">&rarr;</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="font-mono text-[9px] text-white/15">Goal</span>
              </span>
              <span className="text-white/10 text-[8px]">&rarr;</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#f43f5e]" />
                <span className="font-mono text-[9px] text-white/15">Withdraw</span>
              </span>
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}