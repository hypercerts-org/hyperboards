export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blueprints: {
        Row: {
          admin_id: string
          created_at: string
          form_values: Json
          id: number
          minter_address: string
          registry_id: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          form_values: Json
          id?: number
          minter_address: string
          registry_id: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          form_values?: Json
          id?: number
          minter_address?: string
          registry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blueprints_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "users"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "blueprints_registry_id_fkey"
            columns: ["registry_id"]
            referencedRelation: "registries"
            referencedColumns: ["id"]
          }
        ]
      }
      claims: {
        Row: {
          admin_id: string
          chain_id: number
          created_at: string
          hypercert_id: string
          id: string
          owner_id: string
          registry_id: string
        }
        Insert: {
          admin_id: string
          chain_id: number
          created_at?: string
          hypercert_id: string
          id?: string
          owner_id: string
          registry_id: string
        }
        Update: {
          admin_id?: string
          chain_id?: number
          created_at?: string
          hypercert_id?: string
          id?: string
          owner_id?: string
          registry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_registry_id_fkey"
            columns: ["registry_id"]
            referencedRelation: "registries"
            referencedColumns: ["id"]
          }
        ]
      }
      default_sponsor_metadata: {
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
      hyperboard_registries: {
        Row: {
          created_at: string | null
          hyperboard_id: string
          label: string | null
          registry_id: string
        }
        Insert: {
          created_at?: string | null
          hyperboard_id: string
          label?: string | null
          registry_id: string
        }
        Update: {
          created_at?: string | null
          hyperboard_id?: string
          label?: string | null
          registry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hyperboard_registries_hyperboard_id_fkey"
            columns: ["hyperboard_id"]
            referencedRelation: "hyperboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hyperboard_registries_registry_id_fkey"
            columns: ["registry_id"]
            referencedRelation: "registries"
            referencedColumns: ["id"]
          }
        ]
      }
      hyperboards: {
        Row: {
          admin_id: string
          chain_id: number
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          admin_id: string
          chain_id: number
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          admin_id?: string
          chain_id?: number
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      registries: {
        Row: {
          admin_id: string
          chain_id: number
          created_at: string
          description: string
          hidden: boolean
          id: string
          name: string
        }
        Insert: {
          admin_id: string
          chain_id: number
          created_at?: string
          description: string
          hidden?: boolean
          id?: string
          name: string
        }
        Update: {
          admin_id?: string
          chain_id?: number
          created_at?: string
          description?: string
          hidden?: boolean
          id?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string
          auth: Json
          created_at: string
          email: string | null
          id: string | null
        }
        Insert: {
          address: string
          auth?: Json
          created_at?: string
          email?: string | null
          id?: string | null
        }
        Update: {
          address?: string
          auth?: Json
          created_at?: string
          email?: string | null
          id?: string | null
        }
        Relationships: []
      }
      zuzalu_donations: {
        Row: {
          address: string
          amount: string | null
          created_at: string
          email: string
          id: number
        }
        Insert: {
          address: string
          amount?: string | null
          created_at?: string
          email: string
          id?: number
        }
        Update: {
          address?: string
          amount?: string | null
          created_at?: string
          email?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_claim_from_blueprint: {
        Args: {
          registry_id: string
          hypercert_id: string
          chain_id: number
          admin_id: string
          owner_id: string
          blueprint_id: number
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

