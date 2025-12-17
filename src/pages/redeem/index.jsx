import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../apiClient";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { useToast } from "../../components/ui/ToastProvider";
import { formatDate } from "../../utils/format";
import Input from "../../components/ui/Input";

const RedeemCoupon = () => {
  const { shareId } = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  const loadRedeem = async (providedPassword) => {
    setLoading(true);
    try {
      const headers = providedPassword ? { "X-Share-Password": providedPassword } : undefined;
      const { data } = await api.get(`/redeem/${encodeURIComponent(shareId)}`, { headers });
      setPayload(data?.data || null);
      setPasswordRequired(false);
      setPasswordError(null);
    } catch (err) {
      const code = err?.response?.data?.code;
      if (code === "PASSWORD_REQUIRED" || code === "INVALID_PASSWORD") {
        setPasswordRequired(true);
        setPasswordError(code === "INVALID_PASSWORD" ? "Invalid password" : null);
        setPayload(null);
        return;
      }
      setPayload(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shareId) return;
    loadRedeem(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareId]);

  const coupon = payload?.coupon;
  const business = payload?.business;
  const redeemToken = payload?.redeemToken;

  const discountText = useMemo(() => {
    const discount = coupon?.discount || {};
    if (discount?.type === "percentage") return `${discount?.percentage || 0}% OFF`;
    if (discount?.type === "fixed") return `$${discount?.amount || 0} OFF`;
    if (discount?.type === "bogo") return "BOGO OFFER";
    if (discount?.type === "free_shipping") return "FREE SHIPPING";
    return "SPECIAL OFFER";
  }, [coupon?.discount]);

  const expiryText = useMemo(() => {
    const endDate = coupon?.validity?.endDate;
    if (!endDate) return "No expiry";
    return formatDate(endDate, "No expiry");
  }, [coupon?.validity?.endDate]);

  const handleRedeem = async () => {
    if (!coupon?.id || !shareId) return;
    if (!redeemToken) {
      toast.error("Missing redemption token. Please reopen the link and try again.");
      return;
    }
    setRedeeming(true);
    try {
      const validation = await api.post("/redemption/validate", { couponId: coupon.id });
      const valid = validation?.data?.data?.valid;
      if (!valid) {
        toast.error(validation?.data?.data?.reason || "Coupon is not valid");
        return;
      }
      await api.post("/redemption/confirm", {
        couponId: coupon.id,
        shareId,
        redeemToken,
        context: { source: "redeem" },
      });
      setRedeemed(true);
      toast.success("Coupon redeemed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Redemption failed");
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <span>Loading coupon…</span>
        </div>
      </div>
    );
  }

  if (!payload || !coupon) {
    if (passwordRequired) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
          <div className="bg-white rounded-xl border border-border shadow-level-2 p-8 max-w-md w-full">
            <div className="flex items-start space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Icon name="Lock" size={18} className="text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Password required</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  This coupon link is protected. Enter the password to continue.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!password?.trim()) {
                  setPasswordError("Password is required");
                  return;
                }
                setPasswordError(null);
                loadRedeem(password);
              }}
              className="space-y-4"
            >
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                required
                disabled={loading}
              />

              <Button type="submit" variant="default" fullWidth loading={loading} disabled={loading}>
                Continue
              </Button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
        <div className="bg-white rounded-xl border border-border shadow-level-2 p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertTriangle" size={22} className="text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">Coupon not available</h1>
          <p className="text-sm text-muted-foreground">This link may be invalid, expired, or the coupon is no longer active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-xl border border-border shadow-level-2 overflow-hidden">
          <div
            className="p-6 text-white"
            style={{ backgroundColor: coupon?.customization?.colors?.primary || "#1e40af" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">CouponCraft</div>
                <div className="text-lg font-semibold">{business?.name || coupon?.customization?.businessName || "Business"}</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                <Icon name="Ticket" size={18} className="text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-foreground">{discountText}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {coupon?.customization?.description || coupon?.customization?.title || "Present this coupon to redeem."}
              </div>
            </div>

            <div className="bg-muted/40 rounded-lg p-4 text-sm text-muted-foreground space-y-1">
              <div className="flex items-center justify-between">
                <span>Valid until</span>
                <span className="font-medium text-foreground">{expiryText}</span>
              </div>
              {coupon?.customization?.terms && (
                <div className="pt-2 border-t border-border/60 text-xs">
                  {coupon.customization.terms}
                </div>
              )}
            </div>

            <Button
              variant={redeemed ? "outline" : "default"}
              onClick={handleRedeem}
              disabled={redeeming || redeemed}
              loading={redeeming}
              iconName={redeemed ? "CheckCircle" : "Check"}
              iconPosition="left"
              fullWidth
            >
              {redeemed ? "Redeemed" : "Redeem now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemCoupon;
