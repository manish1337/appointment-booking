# Calendar API

## API Endpoints

### Get Free Slots

Retrieve available time slots for a specific date.

```bash
curl -X GET 'http://localhost:3000/api/slots?date=2024-03-20&timezone=America/New_York'
```

### Create Event

Book a new appointment.

```bash
curl -X POST 'http://localhost:3000/api/events' \
  -H 'Content-Type: application/json' \
  -d '{
    "dateTime": "2024-03-20T14:30:00",
    "duration": 30,
    "userId": "123"
  }'
```

### Get Events

Retrieve events for a specific date range.

```bash
curl -X GET 'http://localhost:3000/api/events?startDate=2024-03-20&endDate=2024-03-21'
```

## Response Examples

### Get Free Slots Response

```json
[
  {
    "startTime": "2024-03-20T09:00:00-04:00",
    "endTime": "2024-03-20T09:30:00-04:00"
  },
  {
    "startTime": "2024-03-20T09:30:00-04:00",
    "endTime": "2024-03-20T10:00:00-04:00"
  }
]
```

### Create Event Response

```json
{
  "id": "abc123",
  "startTime": "2024-03-20T14:30:00-04:00",
  "endTime": "2024-03-20T15:00:00-04:00",
  "duration": 30,
  "userId": "123",
  "status": "SCHEDULED"
}
```

### Get Events Response

```json
[
  {
    "id": "abc123",
    "startTime": "2024-03-20T14:30:00-04:00",
    "endTime": "2024-03-20T15:00:00-04:00",
    "duration": 30,
    "userId": "123",
    "status": "SCHEDULED"
  }
]
```
