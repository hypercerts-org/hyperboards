export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      allowlistCache: {
        Row: {
          address: string | null
          claimId: string | null
          created_at: string | null
          fractionCounter: number | null
          hidden: boolean
          id: number
        }
        Insert: {
          address?: string | null
          claimId?: string | null
          created_at?: string | null
          fractionCounter?: number | null
          hidden?: boolean
          id?: number
        }
        Update: {
          address?: string | null
          claimId?: string | null
          created_at?: string | null
          fractionCounter?: number | null
          hidden?: boolean
          id?: number
        }
        Relationships: []
      }
      "allowlistCache-chainId": {
        Row: {
          address: string | null
          chainId: number
          claimId: string | null
          created_at: string | null
          fractionCounter: number | null
          hidden: boolean
          id: number
        }
        Insert: {
          address?: string | null
          chainId: number
          claimId?: string | null
          created_at?: string | null
          fractionCounter?: number | null
          hidden?: boolean
          id?: number
        }
        Update: {
          address?: string | null
          chainId?: number
          claimId?: string | null
          created_at?: string | null
          fractionCounter?: number | null
          hidden?: boolean
          id?: number
        }
        Relationships: []
      }
      "allowlistCache-goerli": {
        Row: {
          address: string | null
          claimId: string | null
          created_at: string | null
          fractionCounter: number | null
          hidden: boolean
          id: number
        }
        Insert: {
          address?: string | null
          claimId?: string | null
          created_at?: string | null
          fractionCounter?: number | null
          hidden?: boolean
          id?: number
        }
        Update: {
          address?: string | null
          claimId?: string | null
          created_at?: string | null
          fractionCounter?: number | null
          hidden?: boolean
          id?: number
        }
        Relationships: []
      }
      "allowlistCache-optimism": {
        Row: {
          address: string | null
          claimId: string | null
          created_at: string | null
          fractionCounter: number | null
          hidden: boolean
          id: number
        }
        Insert: {
          address?: string | null
          claimId?: string | null
          created_at?: string | null
          fractionCounter?: number | null
          hidden?: boolean
          id?: number
        }
        Update: {
          address?: string | null
          claimId?: string | null
          created_at?: string | null
          fractionCounter?: number | null
          hidden?: boolean
          id?: number
        }
        Relationships: []
      }
      "allowlistCache-sepolia": {
        Row: {
          address: string | null
          claimId: string | null
          created_at: string | null
          fractionCounter: number | null
          hidden: boolean
          id: number
        }
        Insert: {
          address?: string | null
          claimId?: string | null
          created_at?: string | null
          fractionCounter?: number | null
          hidden?: boolean
          id?: number
        }
        Update: {
          address?: string | null
          claimId?: string | null
          created_at?: string | null
          fractionCounter?: number | null
          hidden?: boolean
          id?: number
        }
        Relationships: []
      }
      "claim-blueprints-optimism": {
        Row: {
          created_at: string
          form_values: string
          id: string
          minter_address: string
          registry_id: string
        }
        Insert: {
          created_at?: string
          form_values: string
          id?: string
          minter_address: string
          registry_id: string
        }
        Update: {
          created_at?: string
          form_values?: string
          id?: string
          minter_address?: string
          registry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim-blueprints-optimism_registry_id_fkey"
            columns: ["registry_id"]
            isOneToOne: false
            referencedRelation: "registries-optimism"
            referencedColumns: ["id"]
          }
        ]
      }
      "claims-metadata-mapping": {
        Row: {
          chainId: number | null
          claimId: string
          collectionName: string | null
          collision: string | null
          createdAt: number | null
          creatorAddress: string | null
          date: string | null
          featured: boolean | null
          hidden: boolean
          hypercert: Json | null
          id: number
          properties: Json | null
          title: string | null
          totalPrice: number | null
          totalUnits: number | null
        }
        Insert: {
          chainId?: number | null
          claimId: string
          collectionName?: string | null
          collision?: string | null
          createdAt?: number | null
          creatorAddress?: string | null
          date?: string | null
          featured?: boolean | null
          hidden?: boolean
          hypercert?: Json | null
          id?: number
          properties?: Json | null
          title?: string | null
          totalPrice?: number | null
          totalUnits?: number | null
        }
        Update: {
          chainId?: number | null
          claimId?: string
          collectionName?: string | null
          collision?: string | null
          createdAt?: number | null
          creatorAddress?: string | null
          date?: string | null
          featured?: boolean | null
          hidden?: boolean
          hypercert?: Json | null
          id?: number
          properties?: Json | null
          title?: string | null
          totalPrice?: number | null
          totalUnits?: number | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          chainId: number | null
          claimId: string | null
          collectionName: string | null
          created_at: string | null
          featured: boolean | null
          id: number
        }
        Insert: {
          chainId?: number | null
          claimId?: string | null
          collectionName?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: number
        }
        Update: {
          chainId?: number | null
          claimId?: string | null
          collectionName?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: number
        }
        Relationships: []
      }
      "ftc-purchase": {
        Row: {
          address: string
          ethValue: number
          id: number
          textForSponsor: string | null
          timestamp: string
          values: Json
        }
        Insert: {
          address: string
          ethValue: number
          id?: number
          textForSponsor?: string | null
          timestamp?: string
          values: Json
        }
        Update: {
          address?: string
          ethValue?: number
          id?: number
          textForSponsor?: string | null
          timestamp?: string
          values?: Json
        }
        Relationships: []
      }
      "gtc-alpha-allowlist": {
        Row: {
          address: string | null
          id: number
          project: string | null
          units: number | null
        }
        Insert: {
          address?: string | null
          id: number
          project?: string | null
          units?: number | null
        }
        Update: {
          address?: string | null
          id?: number
          project?: string | null
          units?: number | null
        }
        Relationships: []
      }
      "hidden-hypercerts": {
        Row: {
          chainId: number | null
          claimId: string | null
          entry_created_at: string
          hidden: boolean
          id: number
        }
        Insert: {
          chainId?: number | null
          claimId?: string | null
          entry_created_at?: string
          hidden?: boolean
          id?: number
        }
        Update: {
          chainId?: number | null
          claimId?: string | null
          entry_created_at?: string
          hidden?: boolean
          id?: number
        }
        Relationships: []
      }
      "hyperboard-claims": {
        Row: {
          created_at: string
          hypercert_id: string
          id: string
          registry_id: string
        }
        Insert: {
          created_at?: string
          hypercert_id: string
          id?: string
          registry_id: string
        }
        Update: {
          created_at?: string
          hypercert_id?: string
          id?: string
          registry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hyperboard-claims_registry_id_fkey"
            columns: ["registry_id"]
            isOneToOne: false
            referencedRelation: "registries-optimism"
            referencedColumns: ["id"]
          }
        ]
      }
      "hyperboard-sponsor-metadata": {
        Row: {
          address: string
          companyName: string | null
          created_at: string
          firstName: string | null
          id: string
          image: string
          lastName: string | null
          type: string
        }
        Insert: {
          address: string
          companyName?: string | null
          created_at?: string
          firstName?: string | null
          id?: string
          image: string
          lastName?: string | null
          type: string
        }
        Update: {
          address?: string
          companyName?: string | null
          created_at?: string
          firstName?: string | null
          id?: string
          image?: string
          lastName?: string | null
          type?: string
        }
        Relationships: []
      }
      "hypercert-projects": {
        Row: {
          date_to_order: string | null
          description: string | null
          hidden: boolean
          id: number
          link: string | null
          link_display_text: string | null
          name: string | null
          organization: string | null
          stage: string | null
          time_created: string | null
          type: string | null
          visible_date: string | null
        }
        Insert: {
          date_to_order?: string | null
          description?: string | null
          hidden?: boolean
          id?: number
          link?: string | null
          link_display_text?: string | null
          name?: string | null
          organization?: string | null
          stage?: string | null
          time_created?: string | null
          type?: string | null
          visible_date?: string | null
        }
        Update: {
          date_to_order?: string | null
          description?: string | null
          hidden?: boolean
          id?: number
          link?: string | null
          link_display_text?: string | null
          name?: string | null
          organization?: string | null
          stage?: string | null
          time_created?: string | null
          type?: string | null
          visible_date?: string | null
        }
        Relationships: []
      }
      "hypercerts-store": {
        Row: {
          chainId: number | null
          claimId: string | null
          collectionName: string | null
          created_at: string
          hidden: boolean
          id: number
          maxPurchase: number
        }
        Insert: {
          chainId?: number | null
          claimId?: string | null
          collectionName?: string | null
          created_at?: string
          hidden?: boolean
          id?: number
          maxPurchase?: number
        }
        Update: {
          chainId?: number | null
          claimId?: string | null
          collectionName?: string | null
          created_at?: string
          hidden?: boolean
          id?: number
          maxPurchase?: number
        }
        Relationships: []
      }
      "marketplace-orders": {
        Row: {
          additionalParameters: string
          amounts: number[]
          chainId: number
          collection: string
          collectionType: number
          createdAt: string
          currency: string
          endTime: number
          globalNonce: string
          id: string
          itemIds: string[]
          orderNonce: number
          price: string
          quoteType: number
          signature: string
          signer: string
          startTime: number
          strategyId: number
          subsetNonce: number
        }
        Insert: {
          additionalParameters: string
          amounts: number[]
          chainId: number
          collection: string
          collectionType: number
          createdAt?: string
          currency: string
          endTime: number
          globalNonce: string
          id?: string
          itemIds: string[]
          orderNonce: number
          price: string
          quoteType: number
          signature: string
          signer: string
          startTime: number
          strategyId: number
          subsetNonce: number
        }
        Update: {
          additionalParameters?: string
          amounts?: number[]
          chainId?: number
          collection?: string
          collectionType?: number
          createdAt?: string
          currency?: string
          endTime?: number
          globalNonce?: string
          id?: string
          itemIds?: string[]
          orderNonce?: number
          price?: string
          quoteType?: number
          signature?: string
          signer?: string
          startTime?: number
          strategyId?: number
          subsetNonce?: number
        }
        Relationships: []
      }
      "registries-optimism": {
        Row: {
          admin_id: string
          created_at: string
          description: string
          hidden: boolean
          id: string
          name: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          description: string
          hidden?: boolean
          id?: string
          name: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          description?: string
          hidden?: boolean
          id?: string
          name?: string
        }
        Relationships: []
      }
      "zuzalu-community-hypercerts": {
        Row: {
          chainId: number | null
          claimId: string
          collectionName: string | null
          collision: string | null
          createdAt: number | null
          creatorAddress: string | null
          date: string | null
          featured: boolean | null
          hidden: boolean
          hypercert: Json | null
          id: number
          properties: Json | null
          title: string | null
          totalUnits: number | null
        }
        Insert: {
          chainId?: number | null
          claimId: string
          collectionName?: string | null
          collision?: string | null
          createdAt?: number | null
          creatorAddress?: string | null
          date?: string | null
          featured?: boolean | null
          hidden?: boolean
          hypercert?: Json | null
          id?: number
          properties?: Json | null
          title?: string | null
          totalUnits?: number | null
        }
        Update: {
          chainId?: number | null
          claimId?: string
          collectionName?: string | null
          collision?: string | null
          createdAt?: number | null
          creatorAddress?: string | null
          date?: string | null
          featured?: boolean | null
          hidden?: boolean
          hypercert?: Json | null
          id?: number
          properties?: Json | null
          title?: string | null
          totalUnits?: number | null
        }
        Relationships: []
      }
      "zuzalu-purchase": {
        Row: {
          address: string
          ethValue: number
          id: number
          textForSponsor: string | null
          timestamp: string
          values: Json
        }
        Insert: {
          address: string
          ethValue: number
          id?: number
          textForSponsor?: string | null
          timestamp?: string
          values: Json
        }
        Update: {
          address?: string
          ethValue?: number
          id?: number
          textForSponsor?: string | null
          timestamp?: string
          values?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citext:
        | {
            Args: {
              "": boolean
            }
            Returns: string
          }
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      citext_hash: {
        Args: {
          "": string
        }
        Returns: number
      }
      citextin: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      citextout: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      citextrecv: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      citextsend: {
        Args: {
          "": string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
