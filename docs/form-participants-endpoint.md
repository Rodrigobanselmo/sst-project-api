# Form Participants Endpoint

## Overview
This endpoint allows you to browse all employees that are participating in a specific form application based on the form's workspace and hierarchy configurations.

## Endpoint
```
GET /v2/companies/:companyId/forms/applications/:applicationId/participants/
```

## Parameters

### Path Parameters
- `companyId` (string, required): The company ID
- `applicationId` (string, required): The form application ID

### Query Parameters
- `search` (string, optional): Search term to filter participants by name, CPF, or email
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of results per page (default: 10)
- `orderBy` (array, optional): Array of order by objects with `field` and `order` properties

### Order By Fields
- `NAME`: Order by employee name
- `CPF`: Order by employee CPF
- `HIERARCHY`: Order by hierarchy name
- `STATUS`: Order by employee status
- `CREATED_AT`: Order by creation date

## Response
```json
{
  "data": [
    {
      "id": 123,
      "name": "John Doe",
      "cpf": "12345678901",
      "email": "john.doe@example.com",
      "status": "ACTIVE",
      "companyId": "company-id",
      "hierarchyId": "hierarchy-id",
      "hierarchyName": "Engineering Department",
      "hierarchies": [
        {
          "id": "hierarchy-id",
          "name": "Engineering Department",
          "type": "OFFICE"
        },
        {
          "id": "parent-hierarchy-id",
          "name": "Technology Sector",
          "type": "SECTOR"
        }
      ],
      "hasResponded": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "count": 1,
  "totalCount": 1,
  "page": 1,
  "totalPages": 1
}
```

## Logic
The endpoint queries employees based on the form application's participant configuration:
1. Gets the form application and its participants configuration
2. Finds employees whose hierarchy matches the configured hierarchies OR whose hierarchy is linked to the configured workspaces
3. Returns paginated results with employee details and hierarchy information

## Example Usage
```bash
curl -X GET \
  "https://api.example.com/v2/companies/comp123/forms/applications/app456/participants/?search=john&page=1&limit=10" \
  -H "Authorization: Bearer your-jwt-token"
```
