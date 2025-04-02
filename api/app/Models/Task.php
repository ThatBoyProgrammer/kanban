<?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Database\Eloquent\Relations\BelongsTo;

    class Task extends Model
    {
        use HasFactory;

        protected $fillable = [
            'title',
            'description',
            'status',
            'due_date',
            'user_id'
        ];

        // protected $casts = [
        //     'due_date' => 'datetime:Y-m-d H:i:s',
        //     'created_at' => 'datetime',
        //     'updated_at' => 'datetime'
        // ];

        public function user(): BelongsTo
        {
            return $this->belongsTo(User::class);
        }
    }