ALTER TABLE public.ad_metrics_daily
  RENAME COLUMN results TO website_purchases;

ALTER TABLE public.ad_metrics_daily
  DROP COLUMN IF EXISTS result_indicator;

COMMENT ON COLUMN public.ad_metrics_daily.website_purchases IS 'Website purchase count from Meta offsite_conversion.fb_pixel_purchase.';
