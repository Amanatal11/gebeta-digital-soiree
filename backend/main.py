from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def suggest_move_simple(board, current_player, variant):
    """
    Simple move suggestion algorithm:
    Choose the non-empty hole on the current player's side with the maximum number of seeds.
    """
    if variant == '12-hole':
        # For 12-hole variant, players use rows 0 and 1
        player_row = current_player
        holes = board[player_row]
    else:
        # For 18-hole variant, players use rows 0 and 2
        player_row = 0 if current_player == 0 else 2
        holes = board[player_row]
    
    # Find all non-empty holes on the current player's side
    valid_holes = []
    for i, seeds in enumerate(holes):
        if seeds > 0:
            valid_holes.append((i, seeds))
    
    if not valid_holes:
        return None  # No valid moves available
    
    # Return the hole with the maximum number of seeds
    best_hole = max(valid_holes, key=lambda x: x[1])
    return best_hole[0]

def suggest_move_advanced(board, current_player, variant, stores):
    """
    More advanced move suggestion algorithm:
    Considers potential captures and strategic positioning.
    """
    if variant == '12-hole':
        player_row = current_player
        opponent_row = 1 - current_player
    else:
        player_row = 0 if current_player == 0 else 2
        opponent_row = 2 if current_player == 0 else 0
    
    holes = board[player_row]
    opponent_holes = board[opponent_row]
    
    best_move = None
    best_score = -1
    
    for i, seeds in enumerate(holes):
        if seeds == 0:
            continue
            
        score = seeds  # Base score is number of seeds
        
        # Simulate the move to check for potential captures
        # This is a simplified simulation - in a real implementation,
        # you'd want to fully simulate the sowing process
        if variant == '12-hole':
            # Check if this move might lead to a capture
            # (simplified: if we have enough seeds to reach the opposite side)
            if seeds >= (6 - i):
                score += 10  # Bonus for potential capture
        else:
            # For 18-hole, similar logic but more complex
            if seeds >= (6 - i):
                score += 10
        
        # Prefer moves that don't leave opponent with easy captures
        if opponent_holes[i] > 0:
            score += 2  # Small bonus for moves that might disrupt opponent
        
        if score > best_score:
            best_score = score
            best_move = i
    
    return best_move

@app.route('/suggest-move', methods=['POST'])
def suggest_move():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['board', 'currentPlayer', 'variant']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        board = data['board']
        current_player = data['currentPlayer']
        variant = data['variant']
        stores = data.get('stores', [0, 0])
        
        # Validate board structure
        if not isinstance(board, list) or len(board) < 2:
            return jsonify({'error': 'Invalid board structure'}), 400
        
        # Use advanced algorithm if available, fallback to simple
        suggested_hole = suggest_move_advanced(board, current_player, variant, stores)
        if suggested_hole is None:
            suggested_hole = suggest_move_simple(board, current_player, variant)
        
        if suggested_hole is None:
            return jsonify({'error': 'No valid moves available'}), 400
        
        return jsonify({
            'suggestedHole': suggested_hole,
            'confidence': 0.8,  # Simple confidence score
            'reasoning': f'Selected hole {suggested_hole} with {board[current_player if variant == "12-hole" else (0 if current_player == 0 else 2)][suggested_hole]} seeds'
        })
        
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'gebeta-hint-backend'})

if __name__ == '__main__':
    print("Starting Gebeta Hint Backend...")
    print("Backend will be available at: http://localhost:8000")
    print("Health check: http://localhost:8000/health")
    print("Hint endpoint: http://localhost:8000/suggest-move")
    app.run(host='0.0.0.0', port=8000, debug=True)
