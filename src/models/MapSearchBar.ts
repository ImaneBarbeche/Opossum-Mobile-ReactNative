export interface MapSearchBarProps {
  search: string;
  setSearch: (v: string) => void;
  onOpenFilters: () => void;
  onListView: () => void;
  showListButton?: boolean;
  showMapButton?: boolean;
  onMapView?: () => void;
}
