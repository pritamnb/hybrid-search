# Hybrid Search API

## Overview

A high-performance hybrid search solution for magazine content, combining vector and keyword search capabilities using PostgreSQL, pgvector, and Ollama for semantic embeddings.

## Features

- Vector search with semantic embeddings
- Keyword-based full-text search
- Hybrid search combining vector and text search
- Magazine data loading
- Fake data generation for testing

## Technology Stack

- Node.js with TypeScript
- Express.js
- PostgreSQL with pgvector
- Ollama (Snowflake Arctic Embed)
- Docker containerization

## Prerequisites

- Docker
- Node.js (v18+)
- Ollama

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/pritamnb/hybrid-search
cd hybrid-search
```

### 2. Install Ollama
```bash
# MacOS/Linux
curl https://ollama.ai/install.sh | sh

# Pull embedding model
ollama pull snowflake-arctic-embed

# Windows

https://ollama.com/download/windows
```
    
## After ollama installation open terminal and enter the following command

    ollama pull snowflake-arctic-embed


### 3. Docker Configuration
```bash
# Build and start containers
docker-compose up --build

```

### 4. Project Setup
```bash
# Install dependencies
npm install
```
# Create environment configuration
.env file is already present- Update if required

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```
# Hybrid Search API

## Postman Testing Guide

### Import Collection
1. Open Postman
2. Click "Import" button
3. Select `Hybrid Search API.postman_collection.json`

### Endpoint Workflows

#### 1. Load Initial Data
  - Load data first to populate database

- **Load Magazines**: `GET http://localhost:3000/api/load-magazines` **Recommended**

- *Load Fake Data*: `GET http://localhost:3000/api/load-fake-magazines`

- Note : It is recommended to use relevant data for magazine content as vector search will check for cosine similarity.
Fake endpoint will load irrelevant data.

- **Add Magazine Single magazine**: `POST /api/magazine`
  - Body:
    ```json
    {
      "title": "Magazine Title",
      "author": "Author Name",
      "content": "Magazine description",
      "category": "Category"
    }
    ```
    - **Expected response**
    ```json
    {
    "status": "success",
    "data": {
        "magazineInfo": {
            "id": "2155",
            "title": "The Evolution of Fashion Design",
            "author": "Sophia Clark",
            "publication_date": "2025-02-05T16:04:13.512Z",
            "category": "Fashion",
            "updatedAt": "2025-02-05T16:04:13.513Z",
            "createdAt": "2025-02-05T16:04:13.513Z"
        }
    }
    }
    ```

#### 2. Search Endpoints
1. **Vector Search**
   - Endpoint: `GET /api/search/vector`
   - Example : `http://localhost:3000/api/search/vector?query=Architecture&page=1&pageSize=10`

   - **Expected Response**

        ```json
            {
                "status": "success",
                "data": [
                {
                    "id": "19",
                    "title": "Modern Architecture in Urban Environments",
                    "author": "Isabella Mitchell",
                    "content": "The role of modern architecture in shaping the skyline and urban landscapes."
                },
                {
                    "id": "1",
                    "title": "Modern Architecture and Urban Design",
                    "author": "Linda White",
                    "content": "An exploration of how modern architecture and urban planning are reshaping cities and improving quality of life."
                }
                ]
            }
        ```
2. **Keyword Search**
   - Endpoint: `GET /api/search/keyword`
   - Example - `http://localhost:3000/api/search/keyword?query=architecture&page=1&pageSize=10`
   - Params:
     - `query`: Search term
     - `page`: Page number
     - `pageSize`: Results per page
    - **Expected Response**
        ```json
        {
                "status": "success",
                "data": [
            {
                "id": "1",
                "title": "Modern Architecture and Urban Design",
                "author": "Linda White",
                "category": "Architecture",
                "content": "An exploration of how modern architecture and urban planning are reshaping cities and improving quality of life."
            },
            {
                "id": "19",
                "title": "Modern Architecture in Urban Environments",
                "author": "Isabella Mitchell",
                "category": "Architecture",
                "content": "The role of modern architecture in shaping the skyline and urban landscapes."
            }
                ]
        }
        ```
        

3. **Hybrid Search**
   - **Endpoint**: `GET /api/search/hybrid`
   - **Example** : `http://localhost:3000/api/search/hybrid?query=Architecture and Urban&page=1&pageSize=10`

    -**Expected response**

    ```json
        {
        "status": "success",
        "data": [
            {
                "id": "19",
                "title": "Modern Architecture in Urban Environments",
                "author": "Isabella Mitchell",
                "content": "The role of modern architecture in shaping..."
            }
            ]
            }

    ```

#### 4. Magazine Management
- **Get All Magazines**: `GET /api/magazines`
- **Example** : `http://localhost:3000/api/magazines`
- **Expected Response**
    ```json
            {
            "status": "success",
            "data": [
                {
                    "id": "1",
                    "title": "Modern Architecture and Urban Design",
                    "author": "Linda White",
                    "publication_date": "2025-02-05T12:57:05.841Z",
                    "category": "Architecture",
                    "createdAt": "2025-02-05T12:57:05.843Z",
                    "updatedAt": "2025-02-05T12:57:05.843Z"
                },
                {
                    "id": "2",
                    "title": "The Future of AI and Machine Learning",
                    "author": "John Doe",
                    "publication_date": "2025-02-05T12:57:06.122Z",
                    "category": "Technology",
                    "createdAt": "2025-02-05T12:57:06.122Z",
                    "updatedAt": "2025-02-05T12:57:06.122Z"
                }
            ]
            }
    ```
## Recommended Testing Sequence
1. Load Magazines
2. Get Magazines
3. Perform different search types 
    - Keyword search
    - Vector search
    - Hybrid search
4. Add new magazines
5. Verify search results

## Tips
- Ensure local server is running
- Default port: `localhost:3000`
- Check network connectivity
## Database Schema

- `magazine_information`: Magazine metadata
- `magazine_content`: Content with vector embeddings



### Magazine Information Table
- **Unique Identifier**: Automatically generated ID
- **Key Fields**:
  - Title of the magazine
  - Author's name
  - Publication date
  - Category
  - Creation and update timestamps

#### Indexes for Fast Searching on
- author
- category
- title

### Magazine Content Table
- **Unique Identifier**: Automatically generated ID
- **Linked to Magazine Information**: Each content entry connects to a magazine
- **Key Fields**:
  - Full text content
  - Vector embeddings (1024-dimensional)
  - Text search vector
  - Creation and update timestamps

#### Special Search Capabilities
- **Vector Embedding Index**: Enables semantic search
- **Full-Text Search Index**: Allows keyword searching
- **Cosine Similarity Search**: Find semantically similar content

### Why These Indexes Matter
1. **Speed**: Faster search results
2. **Accuracy**: More precise content matching
3. **Flexibility**: Support both keyword and semantic searches

### Search Optimization Techniques
- **HNSW Index**: Hierarchical Navigable Small World for vector search
- **GIN Index**: Fast full-text search

- **Pagination** for efficient querying

This approach allows complex, multi-dimensional searching across magazine content efficiently.



## Performance Reports

Detailed performance analysis available in:
![Performance Report](/Hybrid-Search-API-performance-report.png)


- [View Performance Report pdf](/Hybrid-Search-API-performance-report.pdf)


## Troubleshooting

- Verify Ollama and PostgreSQL are running
- Check `.env` configuration
- Ensure network ports are available

