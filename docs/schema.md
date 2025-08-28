---
description: Description of exam schema.
---

# Schema

Exam files use the `.json` extension. _JSON_, or _JavaScript Object Notation_ is a data format that is supported by many programming languages. Files must use this extension and adhere to the schema defined below.

[Exam Maker](https://exam-maker.herokuapp.com/) allows users to create and share exams without knowing this schema. However, exams can be created in any text editor.

### Example Exam File

```javascript
{
  "author": {
    "id": "your-id-here",
    "name": "Your Name",
    "image": "https://example.com/your-photo.png"
  },
  "createdAt": "2025-08-28T16:12:25Z",
  "title": "Untitled Exam",
  "code": "000-000",
  "time": 60,
  "pass": 60,
  "cover": [
    {
      "variant": 1,
      "text": "Main Title (shows large)"
    },
    {
      "variant": 0,
      "text": "Subtitle or tagline"
    },
    {
      "variant": 2,
      "text": "Any extra cover line"
    }
  ],
  "test": [
    {
      "variant": 1,
      "question": [
        {
          "variant": 1,
          "text": "Replace me with your first question?"
        }
      ],
      "choices": [
        {
          "label": "A",
          "text": "First choice"
        },
        {
          "label": "B",
          "text": "Second choice"
        },
        {
          "label": "C",
          "text": "Third choice"
        },
        {
          "label": "D",
          "text": "Fourth choice"
        }
      ],
      "answer": [
        true,
        false,
        false,
        false
      ],
      "explanation": [
        {
          "variant": 1,
          "text": "Explain why the correct answer(s) are correct."
        }
      ]
    }
  ]
}
```



### Exam

| Property | Description | Type |
| :--- | :--- | :---: |
| **id** | unique identifier | `string` |
| **title** | exam title | `string` |
| **description** | exam description | `string` |
| **author** | exam author | `Author` |
| **createdAt** | creation date | `Date` |
| **code** | certification/exam code | `string` |
| **pass** | minimum passing score percentage | `number`  |
| **time** | time limit in minutes | `number` |
| **image** | URL of exam logo 1:1 size is best | `string` |
| **cover** | first screen of exam | `Node[]` |
| **test** | exam content | `Question[]` |

#### 

### Author

| Property | Description | Type |
| :--- | :--- | :--- |
| **id** | unique identifier | `string` |
| **name** | author name | `string` |
| **image** | author image URL | `string` |

#### 

### Question

| Property | Description | Type |
| :--- | :--- | :--- |
| **variant** | type of question  | `number` |
| **question** | question content | `Node[]` |
| **choices** | answer content | `Choice[]` |
| **answer** | answer key | `boolean/string[]` |
| **explanation** | explanation content | `Node[]` |



### Question Variants

| Variant | Question Type | Answer Example |
| :--- | :--- | :--- |
| **0** | multiple choice | `[true,false,false,false]` |
| **1** | multiple answer | `[true,true,false,false]` |
| **2** | fill in the blank | `[answer,variation,another]` |
| **3** | list order | `[]` |



### Node

| Property | Description | Type |
| :--- | :--- | :--- |
| **variant** | type of node | `number` |
| **text** | content of node | `string` |



### Node Variants

| Variant | Node Type | Text  |
| :--- | :--- | :--- |
| **0** | image | URL of an image |
| **1** | normal text | Normal sized text, most commonly used variant |
| **2** | large text | Large header text |



### Choice

| Property | Description | Type |
| :--- | :--- | :--- |
| **label** | choice label text | `string` |
| **text** | content of choice | `string` |

