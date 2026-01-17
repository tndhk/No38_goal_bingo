export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			boards: {
				Row: {
					id: string;
					user_id: string;
					name: string;
					size: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					user_id: string;
					name: string;
					size: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					name?: string;
					size?: number;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'cells_board_id_fkey';
						columns: ['id'];
						isOneToOne: false;
						referencedRelation: 'cells';
						referencedColumns: ['board_id'];
					}
				];
			};
			cells: {
				Row: {
					id: string;
					board_id: string;
					position: string;
					goal: string;
					is_achieved: boolean;
				};
				Insert: {
					id?: string;
					board_id: string;
					position: string;
					goal?: string;
					is_achieved?: boolean;
				};
				Update: {
					id?: string;
					board_id?: string;
					position?: string;
					goal?: string;
					is_achieved?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: 'cells_board_id_fkey';
						columns: ['board_id'];
						isOneToOne: false;
						referencedRelation: 'boards';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
	};
}
