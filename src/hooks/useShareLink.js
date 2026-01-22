import { useCallback, useEffect, useRef, useState } from "react";
import api from "../apiClient";

export const getShareRoute = (shareId) => `/coupon/${shareId}`;

export const useShareLink = (couponId) => {
  const [shareLinks, setShareLinks] = useState({});
  const cacheRef = useRef(shareLinks);

  useEffect(() => {
    cacheRef.current = shareLinks;
  }, [shareLinks]);

  const upsertShareLink = useCallback((type, share) => {
    if (!type || !share?.id || !share?.url) return;
    setShareLinks((prev) => {
      const next = { ...prev, [type]: share };
      cacheRef.current = next;
      return next;
    });
  }, []);

  const hydrateShares = useCallback((shares) => {
    if (!Array.isArray(shares)) return;
    setShareLinks((prev) => {
      const next = { ...prev };
      shares.forEach((item) => {
        const shareType = item?.type;
        const shareUrl = item?.shareUrl || item?.config?.shareUrl;
        if (shareType && shareUrl) {
          next[shareType] = { id: item?.id, url: shareUrl };
        }
      });
      cacheRef.current = next;
      return next;
    });
  }, []);

  const ensureShare = useCallback(async (type) => {
    if (!couponId) {
      throw new Error("couponId is required to create a share link");
    }

    const cached = cacheRef.current?.[type];
    if (cached) return cached;

    const { data } = await api.post("/shares", { couponId, type });
    const share = data?.data;
    const url = share?.shareUrl || share?.config?.shareUrl || null;
    const next = { id: share?.id, url };
    upsertShareLink(type, next);
    return next;
  }, [couponId, upsertShareLink]);

  return {
    shareLinks,
    ensureShare,
    hydrateShares,
    getShareRoute,
  };
};
