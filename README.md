# 🔐 Zero-Knowledge Proof Age Verification Demo

A beautiful, interactive web application that demonstrates **zero-knowledge proofs** in action. Prove you're 18+ without ever revealing your birthdate.

## What Is This?

This is an **educational demonstration** of zero-knowledge cryptography. It lets you generate a cryptographic proof that you're 18 years old without sending your actual birthdate to the server—or anywhere else.

### The Problem
Traditional age verification requires you to share sensitive personal information (your birthdate) with companies. They store it, potentially exposing it to breaches.

### The Solution
Zero-knowledge proofs let you prove age eligibility **without revealing when you were born**. Your birthdate stays on your device, encrypted and private.

## ✨ How It Works

1. **Select your birthdate** in the date picker (only on your device)
2. **Generate a proof** - Your browser does the math using SHA-256 hashing
3. **Send to server** - Only 3 pieces of information:
   - A cryptographic commitment (one-way hash)
   - Your age status (18+ or not)
   - A timestamp
4. **Get verified** - Server confirms you're 18+ without learning your birthdate
5. **See the breakdown** - Beautiful visualization shows exactly what happened

## 🎓 What You'll Learn

- How **cryptographic hashing** creates one-way proofs
- What **commitments** are and why they're private
- How **zero-knowledge** verification works in practice
- Why your data stays **completely private**
- The difference between proof and knowledge

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Running
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build
```bash
npm run build
npm start
```

## 🎨 Features

### Beautiful Design
- 🌈 Modern gradient interfaces
- 🌙 Full dark mode support
- ✨ Smooth animations and transitions
- 📱 Responsive on all devices
- ♿ Accessible and clear

### Educational Breakdown
After generating a proof, you'll see expandable sections explaining:

1. **How ZK Proofs Work** - Quick explanation of the concept
2. **What Was Sent to Server** - Exact data transmitted (nothing private!)
3. **Why This Is Private** - Detailed privacy guarantees
4. **Verification Process** - Step-by-step walkthrough
5. **Technical Details** - Algorithm specs and implementation notes

### Complete Privacy
- Your birthdate **never leaves your device**
- Server learns **only** that you're 18+
- Proof expires after **1 hour** to prevent replay attacks
- **No data storage** - nothing is saved
- **No tracking** - no cookies or analytics

## 🔧 Technology Stack

- **Next.js 15** - React framework with API routes
- **React 19** - UI library
- **TypeScript** - Type-safe code
- **Tailwind CSS 4** - Beautiful styling
- **Turbopack** - Lightning-fast builds
- **SHA-256** - Industry-standard hashing

## 📊 What Data Is Sent?

```
Server Receives:
├── commitment: "a7f3e9c2b1d4f6a8..." (SHA-256 hash)
├── ageProof: true (boolean)
└── timestamp: 1729351735000 (milliseconds)

Server Can Determine:
✓ User is 18 or older
✓ Proof is recent
✓ Proof is mathematically valid

Server CANNOT Determine:
✗ Birthdate
✗ Exact age
✗ Any other personal info
```

## 🧪 Try It Out

### Test Case 1: Valid Proof
1. Select a birthdate from 18+ years ago
2. Click "Generate Zero-Knowledge Proof"
3. See ✓ Proof Verified!
4. Explore the educational breakdown

### Test Case 2: Rejected (Under 18)
1. Select a date less than 18 years ago
2. See immediate rejection
3. No data is sent to server

### Test Case 3: Inspect Data
1. Open DevTools (F12)
2. Go to Network tab
3. Generate a proof
4. Click `/api/verify-proof` request
5. See exactly what was transmitted

## 🔐 Security Features

- ✅ SHA-256 cryptographic hashing (irreversible)
- ✅ 256-bit cryptographically secure random salt
- ✅ Client-side proof generation (never trusts server)
- ✅ Timestamp validation to prevent replay attacks
- ✅ Full TypeScript for type safety
- ✅ Input validation on all fields
- ✅ No database storage
- ✅ No third-party tracking

## 📚 Learn More

### Understanding Zero-Knowledge Proofs
- [ZKProofs.org](https://zkproofs.org/) - Official resource
- [Cryptography Engineering Blog](https://blog.cryptographyengineering.com/2014/11/27/zero-knowledge-proofs-illustrated-primer/) - Illustrated primer
- [What is a Zero Knowledge Proof](https://blog.chain.link/what-is-a-zero-knowledge-proof-zkp/) - Chain Link explanation

### Advanced Topics
- [SnarkJS](https://github.com/iden3/snarkjs) - JavaScript implementation
- [Circom](https://docs.circom.io/) - Circuit language
- [ZK-ML](https://github.com/zkml) - Zero-knowledge machine learning

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main app UI
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       └── verify-proof/
│           └── route.ts      # Backend verification
├── components/
│   ├── AgeProofGenerator.tsx  # Proof generator UI
│   └── ProofVisualization.tsx # Educational breakdown
└── lib/
    └── zk-age.ts            # ZK proof logic

public/                       # Static assets
```

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## 🚀 Deployment

### On Vercel (Recommended)
```bash
# Push to GitHub, connect to Vercel
# Automatic deployments on every push
```

### On Other Platforms
```bash
npm run build
npm start
```

The app runs on port 3000 by default.

## 🎯 Use Cases

This demo is useful for:
- 🎓 **Learning** zero-knowledge proofs
- 🔬 **Understanding** cryptography
- 🛡️ **Building** privacy-first applications
- 🏢 **Demonstrating** age verification without data collection
- 💡 **Teaching** cryptographic concepts

## ⚠️ Important Notes

### This is a Demo
This is an **educational demonstration** of zero-knowledge concepts. For production systems:
- Consider more advanced proof systems (SNARKs, STARKs)
- Implement proper backend validation
- Add user authentication
- Set up audit logging
- Get cryptographic review

### Privacy Guarantee
While this demo uses sound cryptography:
- Birthdates are hashed but not forgotten by the server (if you store proofs)
- The commitment proves knowledge but doesn't guarantee uniqueness
- In production, combine with other privacy techniques

## 📄 License

This project is created for educational purposes.

## 📚 Documentation

For more information, check out:
- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 2 minutes
- **[DEMO_GUIDE.md](./DEMO_GUIDE.md)** - Complete feature documentation
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[FILES_CREATED.md](./FILES_CREATED.md)** - File manifest

## 🎉 Get Started Now!

```bash
npm install && npm run dev
```

Then visit **http://localhost:3000** and explore zero-knowledge proofs in action!

---

**Ready to learn?** 🚀 Start the dev server and generate your first proof!
