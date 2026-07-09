import math
import networkx as nx

def wind_penalty(road_bearing_deg, wind_dir_deg, wind_speed):
    # angle entre route et vent
    angle = math.radians(road_bearing_deg - wind_dir_deg)
    # vent de face = positif
    return max(0, wind_speed * math.cos(angle))

def build_graph():
    G = nx.DiGraph()

    # graphe simple (à remplacer par OSM plus tard)
    G.add_edge("A", "B", length=5, bearing=0)    # nord
    G.add_edge("B", "C", length=5, bearing=90)   # est
    G.add_edge("A", "C", length=9, bearing=45)   # diagonale

    return G

def best_route(wind_dir, wind_speed):
    G = build_graph()

    for u, v, data in G.edges(data=True):
        penalty = wind_penalty(data["bearing"], wind_dir, wind_speed)
        data["cost"] = data["length"] + penalty

    path = nx.shortest_path(G, "A", "C", weight="cost")
    return path
