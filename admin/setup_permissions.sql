-- ============================================
-- 权限系统完整SQL
-- ============================================

-- 1. 更新profiles表，增加角色和权限字段
alter table public.profiles 
add column if not exists role text default 'user',
add column if not exists permissions jsonb default '[]'::jsonb;

-- 角色说明：
-- super_admin: 超级管理员 - 所有权限，可管理其他管理员
-- admin: 普通管理员 - 可管理内容，不能管理其他管理员
-- user: 普通用户 - 可评论、点赞、编辑自己的资料

-- 2. 给指定用户设置超级管理员
-- 把你自己的邮箱填进去
update public.profiles 
set role = 'super_admin' 
where id in (
    select id from auth.users where email = 'admin@yuanshen.com'
);

-- 3. 创建权限检查函数
create or replace function public.is_super_admin()
returns boolean as $$
begin
    return exists (
        select 1 from public.profiles 
        where id = auth.uid() 
        and role = 'super_admin'
    );
end;
$$ language plpgsql security definer;

create or replace function public.is_admin()
returns boolean as $$
begin
    return exists (
        select 1 from public.profiles 
        where id = auth.uid() 
        and role in ('admin', 'super_admin')
    );
end;
$$ language plpgsql security definer;

-- 4. 重置RLS策略 - 基于角色的权限
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        -- 清除旧策略
        EXECUTE format('drop policy if exists "任何人可读" on public.%I;', t);
        EXECUTE format('drop policy if exists "任何人可写" on public.%I;', t);
        EXECUTE format('drop policy if exists "管理员可写" on public.%I;', t);
        
        -- 新策略1：任何人可读
        EXECUTE format('create policy "任何人可读" on public.%I for select using (true);', t);
        
        -- 新策略2：管理员可写
        EXECUTE format('create policy "管理员可写" on public.%I for all using (public.is_admin()) with check (public.is_admin());', t);
    END LOOP;
END $$;

-- 5. profiles表特殊策略 - 用户只能编辑自己的资料
drop policy if exists "用户可编辑自己资料" on public.profiles;
create policy "用户可编辑自己资料" on public.profiles
    for update using (auth.uid() = id);

-- 6. 评论表特殊策略 - 登录用户可评论
drop policy if exists "登录用户可评论" on public.comments;
create policy "登录用户可评论" on public.comments
    for insert with check (auth.role() = 'authenticated');

-- 7. 社区帖子表特殊策略 - 登录用户可发帖
drop policy if exists "登录用户可发帖" on public.community_posts;
create policy "登录用户可发帖" on public.community_posts
    for insert with check (auth.role() = 'authenticated');

-- 8. 点赞表特殊策略 - 登录用户可点赞
drop policy if exists "登录用户可点赞" on public.likes;
create policy "登录用户可点赞" on public.likes
    for insert with check (auth.role() = 'authenticated');

-- 9. 查看当前所有用户及其角色
SELECT 
    u.email,
    p.role,
    u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
