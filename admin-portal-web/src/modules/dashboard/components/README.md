# Dashboard Module Notes

Backend contract used by this UI:

- `POST /api/auth/login` with `badge_number` and `password`
- `GET /api/admin/dashboard` with `Authorization: Bearer <access_token>`

Dashboard response shape:

- `summary.total_issued`
- `summary.total_unpaid`
- `summary.total_paid`
- `summary.revenue_collected`
- `district_breakdown[]` with `district_name`, `total_fines`, `revenue`
- `recent_activity[]` with `id`, `vehicle_number`, `status`, `base_amount`, `created_at`, `violation`, `officer_name`
